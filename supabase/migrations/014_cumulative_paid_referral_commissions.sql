alter table public.commissions
  drop constraint if exists commissions_commission_amount_check;

alter table public.commissions
  drop constraint if exists commissions_refunded_commission_amount_check;

alter table public.commissions
  drop constraint if exists commissions_order_id_beneficiary_distributor_id_level_key;

alter table public.commissions
  add column if not exists entry_type text not null default 'payment'
    check (entry_type in ('payment', 'tier_adjustment', 'refund_adjustment'));

create index if not exists commissions_distributor_currency_idx
  on public.commissions(beneficiary_distributor_id, currency, status);

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
  v_recorded_commission integer;
  v_adjustment integer;
  v_status text;
begin
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
      v_rate, v_net_revenue, v_adjustment, p_currency, 'pending',
      p_entry_type,
      case when v_adjustment < 0 then p_entry_type else null end,
      now(), now()
    );
  end if;
end;
$$;

revoke all on function public.recalculate_distributor_commission(uuid, text, uuid, uuid, text) from public;
grant execute on function public.recalculate_distributor_commission(uuid, text, uuid, uuid, text) to service_role;

create or replace function public.recalculate_all_distributor_commissions()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
begin
  for v_item in
    select distinct on (referrals.distributor_id, orders.currency)
      referrals.distributor_id,
      orders.currency,
      orders.id as order_id,
      referrals.id as referral_id
    from public.referrals
    join public.orders on orders.referral_id = referrals.id
    order by referrals.distributor_id, orders.currency, orders.updated_at desc
  loop
    perform public.recalculate_distributor_commission(
      v_item.distributor_id,
      v_item.currency,
      v_item.order_id,
      v_item.referral_id,
      'tier_adjustment'
    );
  end loop;
end;
$$;

revoke all on function public.recalculate_all_distributor_commissions() from public;
grant execute on function public.recalculate_all_distributor_commissions() to service_role;

create or replace function public.list_distributor_paid_referral_counts()
returns table(distributor_id uuid, paid_referral_count bigint)
language sql
security definer
set search_path = public
as $$
  select distributors.id,
    count(distinct referrals.id) filter (
      where orders.status in ('paid', 'partially_refunded')
        and coalesce(orders.amount, 0) > coalesce(orders.refunded_amount, 0)
    ) as paid_referral_count
  from public.distributors
  left join public.referrals on referrals.distributor_id = distributors.id
  left join public.orders on orders.referral_id = referrals.id
  group by distributors.id;
$$;

revoke all on function public.list_distributor_paid_referral_counts() from public;
grant execute on function public.list_distributor_paid_referral_counts() to service_role;

create or replace function public.mark_order_paid(
  p_order_id uuid,
  p_payment_intent_id text,
  p_customer_id text,
  p_amount integer,
  p_currency text,
  p_raw_payload jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_application_id uuid;
  v_referral_id uuid;
  v_distributor_id uuid;
  v_timestamp timestamptz := now();
begin
  update public.orders
  set status = 'paid', stripe_payment_intent_id = p_payment_intent_id,
      stripe_customer_id = p_customer_id, amount = p_amount,
      currency = p_currency, updated_at = v_timestamp
  where id = p_order_id
  returning application_id, referral_id into v_application_id, v_referral_id;

  if v_application_id is null then
    raise exception 'Order not found.';
  end if;

  update public.applications set status = 'paid', updated_at = v_timestamp
  where id = v_application_id;

  insert into public.payments (
    id, order_id, provider, provider_payment_id, amount, refunded_amount,
    currency, status, paid_at, raw_payload, created_at
  ) values (
    gen_random_uuid(), p_order_id, 'stripe', p_payment_intent_id, p_amount, 0,
    p_currency, 'succeeded', v_timestamp, p_raw_payload, v_timestamp
  )
  on conflict (provider, provider_payment_id) do update
  set status = excluded.status, amount = excluded.amount,
      currency = excluded.currency, paid_at = excluded.paid_at,
      raw_payload = excluded.raw_payload;

  if v_referral_id is null then return; end if;

  select distributor_id into v_distributor_id
  from public.referrals where id = v_referral_id;

  perform public.recalculate_distributor_commission(
    v_distributor_id, p_currency, p_order_id, v_referral_id, 'payment'
  );
end;
$$;

revoke all on function public.mark_order_paid(uuid, text, text, integer, text, jsonb) from public;
grant execute on function public.mark_order_paid(uuid, text, text, integer, text, jsonb) to service_role;

create or replace function public.sync_charge_refund_totals(
  p_payment_intent_id text,
  p_refunded_amount integer
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_total integer;
  v_fully_refunded boolean;
  v_distributor_id uuid;
begin
  select * into v_order from public.orders
  where stripe_payment_intent_id = p_payment_intent_id for update;

  if not found then return null; end if;
  if v_order.amount is null then raise exception 'Paid order amount is missing.'; end if;

  v_total := greatest(0, least(p_refunded_amount, v_order.amount));
  v_fully_refunded := v_total >= v_order.amount;

  update public.orders
  set refunded_amount = v_total,
      status = case when v_fully_refunded then 'refunded'
                    when v_total > 0 then 'partially_refunded' else 'paid' end,
      updated_at = now()
  where id = v_order.id;

  update public.payments
  set refunded_amount = v_total,
      status = case when v_fully_refunded then 'refunded'
                    when v_total > 0 then 'partially_refunded' else 'succeeded' end
  where provider = 'stripe' and provider_payment_id = p_payment_intent_id;

  if v_fully_refunded then
    update public.applications set status = 'canceled', updated_at = now()
    where id = v_order.application_id;
  end if;

  if v_order.referral_id is not null then
    select distributor_id into v_distributor_id
    from public.referrals where id = v_order.referral_id;

    perform public.recalculate_distributor_commission(
      v_distributor_id, v_order.currency, v_order.id, v_order.referral_id,
      'refund_adjustment'
    );
  end if;

  return v_order.id;
end;
$$;

revoke all on function public.sync_charge_refund_totals(text, integer) from public;
grant execute on function public.sync_charge_refund_totals(text, integer) to service_role;
