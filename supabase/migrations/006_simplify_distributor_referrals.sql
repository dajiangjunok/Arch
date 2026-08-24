drop function if exists public.attach_referral_to_application(uuid, uuid, text);

drop index if exists public.distributors_parent_idx;
drop index if exists public.referral_codes_distributor_idx;

alter table public.distributors
  alter column user_id set not null,
  drop column if exists parent_distributor_id;

alter table public.referral_codes
  drop column if exists code_type,
  drop column if exists auto_approve,
  drop column if exists stripe_promotion_code_id,
  drop column if exists max_uses,
  drop column if exists expires_at;

create unique index if not exists referral_codes_distributor_unique_idx
  on public.referral_codes(distributor_id);

create or replace function public.attach_referral_to_application(
  p_application_id uuid,
  p_user_id uuid,
  p_code text
) returns table(referral_id uuid, distributor_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.referral_codes%rowtype;
  v_referral_id uuid := gen_random_uuid();
begin
  select referral_codes.* into v_code
  from public.referral_codes
  join public.distributors on distributors.id = referral_codes.distributor_id
  where lower(referral_codes.code) = lower(trim(p_code))
    and referral_codes.status = 'active'
    and distributors.status = 'active'
  for update of referral_codes;

  if not found then
    return;
  end if;

  insert into public.referrals (
    id, code_id, distributor_id, user_id, application_id, code_snapshot
  ) values (
    v_referral_id, v_code.id, v_code.distributor_id, p_user_id, p_application_id, v_code.code
  );

  update public.referral_codes
  set used_count = used_count + 1, updated_at = now()
  where id = v_code.id;

  update public.applications
  set referral_id = v_referral_id,
      referral_code = v_code.code,
      distributor_id = v_code.distributor_id,
      updated_at = now()
  where id = p_application_id;

  return query select v_referral_id, v_code.distributor_id;
end;
$$;

revoke all on function public.attach_referral_to_application(uuid, uuid, text) from public;
grant execute on function public.attach_referral_to_application(uuid, uuid, text) to service_role;

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

  select referrals.distributor_id, distributors.commission_rate, distributors.status
  into v_distributor_id, v_rate, v_status
  from public.referrals
  join public.distributors on distributors.id = referrals.distributor_id
  where referrals.id = v_referral_id;

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
