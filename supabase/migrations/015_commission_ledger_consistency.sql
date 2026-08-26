alter table public.commissions
  drop constraint if exists commissions_entry_type_check;

alter table public.commissions
  add constraint commissions_entry_type_check
  check (entry_type in ('payment', 'tier_adjustment', 'refund_adjustment', 'status_adjustment'));

-- Older admin reversals did not record why they were reversed. Treat them as
-- deliberate manual reversals so a later automatic recalculation does not
-- recreate the same commission.
update public.commissions
set reversal_reason = 'manual_reversal',
    reversed_at = coalesce(reversed_at, updated_at, now())
where status = 'reversed'
  and reversal_reason is null;

-- Deductions do not require an approval decision: they are automatically
-- applied to the distributor's open balance and can later be marked settled.
update public.commissions
set status = 'approved', updated_at = now()
where commission_amount < 0
  and status = 'pending';

create or replace function public.recalculate_distributor_commission(
  p_distributor_id uuid,
  p_currency text,
  p_trigger_order_id uuid,
  p_trigger_referral_id uuid,
  p_entry_type text default 'payment'
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_paid_referral_count integer;
  v_net_revenue integer;
  v_rate numeric(5, 2);
  v_target_commission integer;
  v_manual_reversal integer;
  v_recorded_commission integer;
  v_adjustment integer;
  v_status text;
begin
  if p_entry_type not in ('payment', 'tier_adjustment', 'refund_adjustment', 'status_adjustment') then
    raise exception 'Invalid commission entry type.';
  end if;

  select status into v_status
  from public.distributors
  where id = p_distributor_id
  for update;

  if not found then
    return;
  end if;

  select count(distinct referrals.id)::integer
  into v_paid_referral_count
  from public.referrals
  join public.orders on orders.referral_id = referrals.id
  where referrals.distributor_id = p_distributor_id
    and orders.status in ('paid', 'partially_refunded')
    and coalesce(orders.amount, 0) > coalesce(orders.refunded_amount, 0);

  select coalesce(sum(orders.amount - orders.refunded_amount), 0)::integer
  into v_net_revenue
  from public.referrals
  join public.orders on orders.referral_id = referrals.id
  where referrals.distributor_id = p_distributor_id
    and orders.currency = p_currency
    and orders.status in ('paid', 'partially_refunded')
    and coalesce(orders.amount, 0) > coalesce(orders.refunded_amount, 0);

  select commission_rate into v_rate
  from public.distributor_tiers
  where minimum_referrals <= v_paid_referral_count
  order by minimum_referrals desc
  limit 1;

  v_rate := case when v_status = 'active' then coalesce(v_rate, 0) else 0 end;
  v_target_commission := floor(v_net_revenue * v_rate / 100)::integer;

  -- A manual reversal permanently waives that amount of commission. It is
  -- deducted from future entitlement without ever creating a negative balance.
  select coalesce(sum(commission_amount), 0)::integer
  into v_manual_reversal
  from public.commissions
  where beneficiary_distributor_id = p_distributor_id
    and currency = p_currency
    and status = 'reversed'
    and reversal_reason = 'manual_reversal';

  v_target_commission := greatest(0, v_target_commission - v_manual_reversal);

  -- System-reversed and manually reversed rows are not part of the open ledger;
  -- the manual amount has already been incorporated into the target above.
  select coalesce(sum(commission_amount), 0)::integer
  into v_recorded_commission
  from public.commissions
  where beneficiary_distributor_id = p_distributor_id
    and currency = p_currency
    and status <> 'reversed';

  v_adjustment := v_target_commission - v_recorded_commission;

  if v_adjustment <> 0 then
    insert into public.commissions (
      id, order_id, referral_id, beneficiary_distributor_id, level,
      rate, basis_amount, commission_amount, currency, status,
      entry_type, reversal_reason, created_at, updated_at
    ) values (
      gen_random_uuid(), p_trigger_order_id, p_trigger_referral_id, p_distributor_id, 1,
      v_rate, v_net_revenue, v_adjustment, p_currency,
      case when v_adjustment < 0 then 'approved' else 'pending' end,
      p_entry_type,
      case when v_adjustment < 0 then p_entry_type else null end,
      now(), now()
    );
  end if;
end;
$$;

revoke all on function public.recalculate_distributor_commission(uuid, text, uuid, uuid, text) from public;
grant execute on function public.recalculate_distributor_commission(uuid, text, uuid, uuid, text) to service_role;

create or replace function public.recalculate_distributor_commissions(
  p_distributor_id uuid,
  p_entry_type text default 'status_adjustment'
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
begin
  for v_item in
    select distinct on (items.currency)
      items.currency,
      items.order_id,
      items.referral_id
    from (
      select orders.currency, orders.id as order_id, referrals.id as referral_id, orders.updated_at
      from public.referrals
      join public.orders on orders.referral_id = referrals.id
      where referrals.distributor_id = p_distributor_id

      union all

      select commissions.currency, commissions.order_id, commissions.referral_id, commissions.updated_at
      from public.commissions
      where commissions.beneficiary_distributor_id = p_distributor_id
    ) as items
    order by items.currency, items.updated_at desc
  loop
    perform public.recalculate_distributor_commission(
      p_distributor_id,
      v_item.currency,
      v_item.order_id,
      v_item.referral_id,
      p_entry_type
    );
  end loop;
end;
$$;

revoke all on function public.recalculate_distributor_commissions(uuid, text) from public;
grant execute on function public.recalculate_distributor_commissions(uuid, text) to service_role;

create or replace function public.set_distributor_status(
  p_distributor_id uuid,
  p_status text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('active', 'inactive') then
    raise exception 'Invalid distributor status.';
  end if;

  update public.distributors
  set status = p_status, updated_at = now()
  where id = p_distributor_id;

  if not found then
    raise exception 'Distributor not found.';
  end if;

  update public.referral_codes
  set status = p_status, updated_at = now()
  where distributor_id = p_distributor_id;

  perform public.recalculate_distributor_commissions(
    p_distributor_id,
    'status_adjustment'
  );
end;
$$;

revoke all on function public.set_distributor_status(uuid, text) from public;
grant execute on function public.set_distributor_status(uuid, text) to service_role;

create or replace function public.set_commission_status(
  p_commission_id uuid,
  p_status text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_commission public.commissions%rowtype;
begin
  select * into v_commission
  from public.commissions
  where id = p_commission_id
  for update;

  if not found then
    raise exception 'Commission not found.';
  end if;

  if v_commission.commission_amount < 0 then
    if v_commission.status <> 'approved' or p_status <> 'paid' then
      raise exception 'A deduction can only move from approved to applied.';
    end if;
  elsif not (
    (v_commission.status = 'pending' and p_status in ('approved', 'reversed'))
    or (v_commission.status = 'approved' and p_status in ('paid', 'reversed'))
  ) then
    raise exception 'Invalid commission status transition.';
  end if;

  update public.commissions
  set status = p_status,
      paid_at = case when p_status = 'paid' then now() else null end,
      reversed_at = case when p_status = 'reversed' then now() else null end,
      reversal_reason = case
        when p_status = 'reversed' then 'manual_reversal'
        else reversal_reason
      end,
      updated_at = now()
  where id = p_commission_id;
end;
$$;

revoke all on function public.set_commission_status(uuid, text) from public;
grant execute on function public.set_commission_status(uuid, text) to service_role;
