-- Historical entries used the cumulative tier model, including any Fellowship
-- revenue. Keep those entries intact and reconcile each model below.
alter table public.commissions
  add column commission_model text not null default 'tiered'
    check (commission_model in ('tiered', 'fellowship'));

create or replace function public.list_distributor_paid_referral_counts()
returns table(distributor_id uuid, paid_referral_count bigint)
language sql
security definer
set search_path = public
as $$
  select distributors.id,
    count(distinct referrals.id) filter (
      where orders.selected_ticket in ('single_week', 'two_weeks', 'full_program')
        and orders.status in ('paid', 'partially_refunded')
        and coalesce(orders.amount, 0) > coalesce(orders.refunded_amount, 0)
    ) as paid_referral_count
  from public.distributors
  left join public.referrals on referrals.distributor_id = distributors.id
  left join public.orders on orders.referral_id = referrals.id
  group by distributors.id;
$$;

revoke all on function public.list_distributor_paid_referral_counts() from public;
grant execute on function public.list_distributor_paid_referral_counts() to service_role;

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
  v_tier_rate numeric(5, 2);
  v_rate numeric(5, 2);
  v_model text;
  v_net_revenue bigint;
  v_tier_revenue bigint;
  v_fellowship_revenue bigint;
  v_tier_target bigint;
  v_fellowship_target bigint;
  v_tier_reversal bigint;
  v_fellowship_reversal bigint;
  v_target_commission bigint;
  v_recorded_commission bigint;
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

  if not found then return; end if;

  -- Qualification spans currencies, but only Single Week Access referrals.
  select count(distinct referrals.id)::integer
  into v_paid_referral_count
  from public.referrals
  join public.orders on orders.referral_id = referrals.id
  where referrals.distributor_id = p_distributor_id
    and orders.selected_ticket in ('single_week', 'two_weeks', 'full_program')
    and orders.status in ('paid', 'partially_refunded')
    and coalesce(orders.amount, 0) > coalesce(orders.refunded_amount, 0);

  select commission_rate into v_tier_rate
  from public.distributor_tiers
  where minimum_referrals <= v_paid_referral_count
  order by minimum_referrals desc
  limit 1;

  select
    coalesce(sum(orders.amount - orders.refunded_amount) filter (
      where orders.selected_ticket in ('single_week', 'two_weeks', 'full_program')
    ), 0),
    coalesce(sum(orders.amount - orders.refunded_amount) filter (
      where orders.selected_ticket in (
        'fellowship', 'fellowship_single_week', 'fellowship_two_weeks', 'fellowship_full_program'
      )
    ), 0)
  into v_tier_revenue, v_fellowship_revenue
  from public.referrals
  join public.orders on orders.referral_id = referrals.id
  where referrals.distributor_id = p_distributor_id
    and orders.currency = p_currency
    and orders.status in ('paid', 'partially_refunded')
    and coalesce(orders.amount, 0) > coalesce(orders.refunded_amount, 0);

  v_tier_rate := case when v_status = 'active' then coalesce(v_tier_rate, 0) else 0 end;
  v_tier_target := floor(v_tier_revenue * v_tier_rate / 100);
  v_fellowship_target := case when v_status = 'active' then floor(v_fellowship_revenue * 10 / 100.0) else 0 end;

  -- Waive the reversed entry's own model first so a recalculation does not
  -- recreate it in that model. Any excess still reduces the other model,
  -- preserving the existing currency-wide waiver, including legacy reversals.
  select
    coalesce(sum(commission_amount) filter (where commission_model = 'tiered'), 0),
    coalesce(sum(commission_amount) filter (where commission_model = 'fellowship'), 0)
  into v_tier_reversal, v_fellowship_reversal
  from public.commissions
  where beneficiary_distributor_id = p_distributor_id
    and currency = p_currency
    and status = 'reversed'
    and reversal_reason = 'manual_reversal';

  foreach v_model in array array['tiered', 'fellowship'] loop
    if v_model = 'tiered' then
      v_rate := v_tier_rate;
      v_net_revenue := v_tier_revenue;
      v_target_commission := greatest(
        0, v_tier_target - v_tier_reversal - greatest(0, v_fellowship_reversal - v_fellowship_target)
      );
    else
      v_rate := case when v_status = 'active' then 10 else 0 end;
      v_net_revenue := v_fellowship_revenue;
      v_target_commission := greatest(
        0, v_fellowship_target - v_fellowship_reversal - greatest(0, v_tier_reversal - v_tier_target)
      );
    end if;

    select coalesce(sum(commission_amount), 0)
    into v_recorded_commission
    from public.commissions
    where beneficiary_distributor_id = p_distributor_id
      and currency = p_currency
      and commission_model = v_model
      and status <> 'reversed';

    v_adjustment := v_target_commission - v_recorded_commission;
    if v_adjustment <> 0 then
      insert into public.commissions (
        id, order_id, referral_id, beneficiary_distributor_id, level,
        rate, basis_amount, commission_amount, currency, status,
        commission_model, entry_type, reversal_reason, created_at, updated_at
      ) values (
        gen_random_uuid(), p_trigger_order_id, p_trigger_referral_id, p_distributor_id, 1,
        v_rate, v_net_revenue, v_adjustment, p_currency,
        case when v_adjustment < 0 then 'approved' else 'pending' end,
        v_model, p_entry_type,
        case when v_adjustment < 0 then p_entry_type else null end,
        now(), now()
      );
    end if;
  end loop;
end;
$$;

revoke all on function public.recalculate_distributor_commission(uuid, text, uuid, uuid, text) from public;
grant execute on function public.recalculate_distributor_commission(uuid, text, uuid, uuid, text) to service_role;

-- Append adjustments for existing balances, including previously settled
-- entries. Repeating a recalculation does not issue another commission.
select public.recalculate_all_distributor_commissions();
