-- One ordinary invite code and one optional fixed-discount code per distributor.
alter table public.distributors add column discount_enabled boolean not null default false;
alter table public.referral_codes add column kind text not null default 'referral'
  check (kind in ('referral', 'discount'));
drop index public.referral_codes_distributor_unique_idx;
create unique index referral_codes_distributor_kind_idx on public.referral_codes(distributor_id, kind);

alter table public.applications
  add column discount_code text,
  add column original_amount integer,
  add column discount_amount integer not null default 0,
  add column amount_due integer,
  add column pricing_currency text,
  add column stripe_coupon_id text;
alter table public.orders
  add column discount_code text,
  add column original_amount integer,
  add column discount_amount integer not null default 0,
  add column amount_due integer,
  add column pricing_currency text,
  add column stripe_coupon_id text;

-- Legacy/full-price records keep their existing pricing behavior. Only discounted
-- applications have a fixed USD price snapshot. NULL must not bypass these checks.
alter table public.applications add constraint applications_discount_snapshot_check check (
  case when discount_code is null then
    discount_amount = 0 and original_amount is null and amount_due is null
    and pricing_currency is null and stripe_coupon_id is null
  else coalesce(
    selected_ticket = 'single_week' and original_amount = 979900
    and discount_amount = 129900 and amount_due = 850000 and pricing_currency = 'usd'
    and length(stripe_coupon_id) > 0 and referral_code = discount_code
    and referral_id is not null and distributor_id is not null, false)
  end
);
alter table public.orders add constraint orders_discount_snapshot_check check (
  case when discount_code is null then
    discount_amount = 0 and original_amount is null and amount_due is null
    and pricing_currency is null and stripe_coupon_id is null
  else coalesce(
    selected_ticket = 'single_week' and original_amount = 979900
    and discount_amount = 129900 and amount_due = 850000 and pricing_currency = 'usd'
    and amount = amount_due and currency = pricing_currency
    and length(stripe_coupon_id) > 0 and referral_code = discount_code
    and referral_id is not null and distributor_id is not null, false)
  end
);

-- Submission and attribution now happen together through the server-only RPC.
-- Do not let authenticated clients supply their own prices/attribution via INSERT.
drop policy if exists "Users can create own applications" on public.applications;
-- Keep the legacy RPC available during deployment, but ordinary invitations
-- are its only valid input. A discount always requires atomic submission.

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
    and referral_codes.kind = 'referral'
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

create function public.set_distributor_discount(p_distributor_id uuid, p_enabled boolean)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_status text;
begin
  select status into v_status from public.distributors where id = p_distributor_id for update;
  if not found then raise exception 'Distributor not found.'; end if;
  if p_enabled is null then raise exception 'Invalid discount setting.'; end if;
  if p_enabled and v_status <> 'active' then raise exception 'Enable the distributor first.'; end if;
  if p_enabled then
    insert into public.referral_codes(id, code, distributor_id, kind, status)
    values (gen_random_uuid(), 'SAVE-' || upper(replace(gen_random_uuid()::text, '-', '')), p_distributor_id, 'discount', 'active')
    on conflict (distributor_id, kind) do nothing;
  end if;
  update public.distributors set discount_enabled = p_enabled, updated_at = now() where id = p_distributor_id;
end;
$$;
revoke all on function public.set_distributor_discount(uuid, boolean) from public;
grant execute on function public.set_distributor_discount(uuid, boolean) to service_role;

create function public.submit_application(
  p_user_id uuid, p_details jsonb, p_code text default '', p_stripe_coupon_id text default null
) returns setof public.applications
language plpgsql security definer set search_path = public as $$
declare
  v_code public.referral_codes%rowtype;
  v_distributor public.distributors%rowtype;
  v_application public.applications%rowtype;
  v_referral_id uuid;
  v_discount boolean := false;
begin
  if p_user_id is null then raise exception 'A signed-in user is required.'; end if;
  if coalesce(trim(p_code), '') <> '' then
    select * into v_code from public.referral_codes where lower(code) = lower(trim(p_code));
    if not found then raise exception 'This code is invalid or no longer available.'; end if;
    -- Same lock order as administrator actions: distributor, then code.
    select * into v_distributor from public.distributors where id = v_code.distributor_id for share;
    select * into v_code from public.referral_codes where id = v_code.id for update;
    if v_distributor.status <> 'active' or v_code.status <> 'active'
      or (v_code.kind = 'discount' and not v_distributor.discount_enabled) then
      raise exception 'This code is invalid or no longer available.';
    end if;
    v_discount := v_code.kind = 'discount';
    if v_discount and p_details->>'selectedTicket' is distinct from 'single_week' then
      raise exception 'This discount is only available for the 1 Week program.';
    end if;
    if v_discount and coalesce(trim(p_stripe_coupon_id), '') = '' then
      raise exception 'Stripe discount is not configured.';
    end if;
    v_referral_id := gen_random_uuid();
  end if;

  insert into public.applications (
    id, user_id, name, email, company, title, country, city, applicant_type,
    selected_ticket, selected_weeks, alternate_contact, message, additional_info, status,
    referral_id, referral_code, distributor_id,
    discount_code, original_amount, discount_amount, amount_due, pricing_currency, stripe_coupon_id
  ) values (
    gen_random_uuid(), p_user_id, trim(p_details->>'name'), lower(trim(p_details->>'email')),
    '', '', '', '', 'other', p_details->>'selectedTicket',
    array(select jsonb_array_elements_text(p_details->'selectedWeeks')),
    trim(p_details->>'alternateContact'), trim(p_details->>'message'), coalesce(trim(p_details->>'additionalInfo'), ''),
    'pending_review', v_referral_id, v_code.code, v_code.distributor_id,
    case when v_discount then v_code.code end,
    case when v_discount then 979900 end, case when v_discount then 129900 else 0 end,
    case when v_discount then 850000 end, case when v_discount then 'usd' end,
    case when v_discount then p_stripe_coupon_id end
  ) returning * into v_application;

  if v_referral_id is not null then
    insert into public.referrals(id, code_id, distributor_id, user_id, application_id, code_snapshot, attribution_method)
    values(v_referral_id, v_code.id, v_code.distributor_id, p_user_id, v_application.id, v_code.code, 'application_code');
    update public.referral_codes set used_count = used_count + 1, updated_at = now() where id = v_code.id;
  end if;
  return next v_application;
end;
$$;
revoke all on function public.submit_application(uuid, jsonb, text, text) from public;
grant execute on function public.submit_application(uuid, jsonb, text, text) to service_role;

-- Serialize order creation for an application so repeated approval clicks reuse
-- one order and one Stripe idempotency key. Never re-price a saved discount.
create function public.create_application_order(p_application_id uuid, p_amount integer, p_currency text)
returns setof public.orders language plpgsql security definer set search_path = public as $$
declare
  v_application public.applications%rowtype;
  v_order public.orders%rowtype;
begin
  select * into v_application from public.applications where id = p_application_id for update;
  if not found then raise exception 'Application not found.'; end if;
  if v_application.selected_ticket = 'fellowship' or v_application.status not in ('approved', 'payment_sent') then
    raise exception 'This application is not approved for payment.';
  end if;
  if exists (select 1 from public.orders where application_id = p_application_id and status in ('paid', 'partially_refunded', 'refunded')) then
    raise exception 'This application already has a completed payment.';
  end if;
  select * into v_order from public.orders where application_id = p_application_id order by created_at desc limit 1;
  if found then return next v_order; return; end if;
  insert into public.orders (
    id, user_id, application_id, selected_ticket, amount, currency, status,
    referral_id, referral_code, distributor_id,
    discount_code, original_amount, discount_amount, amount_due, pricing_currency, stripe_coupon_id
  ) values (
    gen_random_uuid(), v_application.user_id, v_application.id, v_application.selected_ticket,
    coalesce(v_application.amount_due, p_amount), coalesce(v_application.pricing_currency, p_currency), 'pending',
    v_application.referral_id, v_application.referral_code, v_application.distributor_id,
    v_application.discount_code, v_application.original_amount, v_application.discount_amount,
    v_application.amount_due, v_application.pricing_currency, v_application.stripe_coupon_id
  ) returning * into v_order;
  return next v_order;
end;
$$;
revoke all on function public.create_application_order(uuid, integer, text) from public;
grant execute on function public.create_application_order(uuid, integer, text) to service_role;

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
  v_order public.orders%rowtype;
  v_application_id uuid;
  v_referral_id uuid;
  v_distributor_id uuid;
  v_timestamp timestamptz := now();
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found.'; end if;
  if v_order.stripe_checkout_session_id is null or p_payment_intent_id is null or p_amount is null or p_amount <= 0
    or p_raw_payload #>> '{data,object,payment_status}' is distinct from 'paid'
    or p_raw_payload #>> '{data,object,id}' is distinct from v_order.stripe_checkout_session_id then
    raise exception 'Payment is not confirmed for this checkout session.';
  end if;
  if v_order.discount_code is not null and (p_amount <> v_order.amount_due or p_currency is distinct from v_order.pricing_currency) then
    raise exception 'Payment does not match the saved discount price.';
  end if;
  -- Distinct Stripe events can describe the same payment. A late event must
  -- never reset a partially/full refunded order or recreate its commission.
  if v_order.status in ('paid', 'partially_refunded', 'refunded') then
    if v_order.stripe_payment_intent_id is distinct from p_payment_intent_id then
      raise exception 'Order already has a different payment.';
    end if;
    return;
  end if;
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
