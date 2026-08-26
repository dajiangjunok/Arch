create table if not exists public.distributor_tiers (
  id uuid primary key default gen_random_uuid(),
  tier_key text not null unique check (tier_key in ('single_seat', 'starter', 'standard', 'growth')),
  name text not null,
  minimum_referrals integer not null check (minimum_referrals >= 1),
  commission_rate numeric(5, 2) not null check (commission_rate >= 0 and commission_rate <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.distributor_tiers (tier_key, name, minimum_referrals, commission_rate)
values
  ('single_seat', 'Single Seat', 1, 9),
  ('starter', 'Starter', 3, 15),
  ('standard', 'Standard', 5, 20),
  ('growth', 'Growth', 10, 30)
on conflict (tier_key) do nothing;

alter table public.distributor_tiers enable row level security;

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
  v_referral_count integer;
  v_rate numeric(5, 2);
  v_status text;
  v_timestamp timestamptz := now();
begin
  update public.orders
  set status = 'paid',
      stripe_payment_intent_id = p_payment_intent_id,
      stripe_customer_id = p_customer_id,
      amount = p_amount,
      currency = p_currency,
      updated_at = v_timestamp
  where id = p_order_id
  returning application_id, referral_id into v_application_id, v_referral_id;

  if v_application_id is null then
    raise exception 'Order not found.';
  end if;

  update public.applications
  set status = 'paid', updated_at = v_timestamp
  where id = v_application_id;

  insert into public.payments (
    id, order_id, provider, provider_payment_id, amount, currency,
    status, paid_at, raw_payload, created_at
  ) values (
    gen_random_uuid(), p_order_id, 'stripe', p_payment_intent_id, p_amount,
    p_currency, 'succeeded', v_timestamp, p_raw_payload, v_timestamp
  )
  on conflict (provider, provider_payment_id) do update
  set status = excluded.status,
      amount = excluded.amount,
      currency = excluded.currency,
      paid_at = excluded.paid_at,
      raw_payload = excluded.raw_payload;

  if v_referral_id is null then
    return;
  end if;

  select referrals.distributor_id, distributors.status
  into v_distributor_id, v_status
  from public.referrals
  join public.distributors on distributors.id = referrals.distributor_id
  where referrals.id = v_referral_id;

  select count(*) into v_referral_count
  from public.referrals
  where distributor_id = v_distributor_id;

  select commission_rate into v_rate
  from public.distributor_tiers
  where minimum_referrals <= v_referral_count
  order by minimum_referrals desc
  limit 1;

  if v_status = 'active' and coalesce(v_rate, 0) > 0 then
    insert into public.commissions (
      id, order_id, referral_id, beneficiary_distributor_id, level,
      rate, basis_amount, commission_amount, currency, status, created_at
    ) values (
      gen_random_uuid(), p_order_id, v_referral_id, v_distributor_id, 1,
      v_rate, coalesce(p_amount, 0), floor(coalesce(p_amount, 0) * v_rate / 100),
      p_currency, 'pending', v_timestamp
    )
    on conflict (order_id, beneficiary_distributor_id, level) do nothing;
  end if;
end;
$$;

revoke all on function public.mark_order_paid(uuid, text, text, integer, text, jsonb) from public;
grant execute on function public.mark_order_paid(uuid, text, text, integer, text, jsonb) to service_role;
