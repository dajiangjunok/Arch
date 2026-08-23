alter table public.orders
  add column if not exists refunded_amount integer not null default 0;

alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in (
    'pending', 'checkout_created', 'paid', 'partially_refunded',
    'payment_failed', 'canceled', 'refunded', 'expired'
  ));

alter table public.orders
  drop constraint if exists orders_refunded_amount_check;

alter table public.orders
  add constraint orders_refunded_amount_check
  check (refunded_amount >= 0 and (amount is null or refunded_amount <= amount));

update public.orders
set refunded_amount = coalesce(amount, 0)
where status = 'refunded'
  and refunded_amount = 0;

alter table public.payments
  add column if not exists refunded_amount integer not null default 0;

alter table public.payments
  drop constraint if exists payments_status_check;

alter table public.payments
  add constraint payments_status_check
  check (status in ('processing', 'succeeded', 'partially_refunded', 'failed', 'refunded'));

alter table public.payments
  drop constraint if exists payments_refunded_amount_check;

alter table public.payments
  add constraint payments_refunded_amount_check
  check (refunded_amount >= 0 and (amount is null or refunded_amount <= amount));

update public.payments
set refunded_amount = coalesce(amount, 0)
where status = 'refunded'
  and refunded_amount = 0;

alter table public.commissions
  add column if not exists refunded_basis_amount integer not null default 0,
  add column if not exists refunded_commission_amount integer not null default 0;

alter table public.commissions
  drop constraint if exists commissions_refunded_basis_amount_check;

alter table public.commissions
  add constraint commissions_refunded_basis_amount_check
  check (refunded_basis_amount >= 0 and refunded_basis_amount <= basis_amount);

alter table public.commissions
  drop constraint if exists commissions_refunded_commission_amount_check;

alter table public.commissions
  add constraint commissions_refunded_commission_amount_check
  check (refunded_commission_amount >= 0 and refunded_commission_amount <= commission_amount);

update public.commissions
set refunded_basis_amount = basis_amount,
    refunded_commission_amount = commission_amount
where status = 'reversed'
  and reversal_reason = 'payment_refunded';

create table if not exists public.refund_requests (
  id uuid primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  requested_amount integer not null check (requested_amount > 0),
  approved_amount integer check (approved_amount > 0),
  currency text not null,
  reason text not null,
  admin_note text,
  status text not null default 'pending' check (
    status in ('pending', 'processing', 'succeeded', 'rejected', 'failed', 'canceled')
  ),
  stripe_refund_id text unique,
  stripe_status text,
  failure_reason text,
  reviewed_by text,
  reviewed_at timestamptz,
  completed_at timestamptz,
  raw_payload jsonb,
  last_stripe_event_created bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists refund_requests_user_id_idx
  on public.refund_requests(user_id, created_at desc);

create index if not exists refund_requests_status_idx
  on public.refund_requests(status, created_at desc);

create index if not exists refund_requests_order_id_idx
  on public.refund_requests(order_id, created_at desc);

create unique index if not exists refund_requests_one_active_per_order_idx
  on public.refund_requests(order_id)
  where status in ('pending', 'processing');

alter table public.refund_requests enable row level security;

drop policy if exists "Users can read own refund requests" on public.refund_requests;
create policy "Users can read own refund requests"
  on public.refund_requests for select to authenticated
  using (auth.uid() = user_id);

create or replace function public.create_refund_request(
  p_order_id uuid,
  p_user_id uuid,
  p_requested_amount integer,
  p_reason text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_request_id uuid := gen_random_uuid();
begin
  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found.';
  end if;

  if v_order.user_id is distinct from p_user_id then
    raise exception 'Order not found.';
  end if;

  if v_order.status not in ('paid', 'partially_refunded')
    or v_order.amount is null
    or v_order.stripe_payment_intent_id is null then
    raise exception 'Order is not eligible for a refund request.';
  end if;

  if p_requested_amount <= 0
    or p_requested_amount > (v_order.amount - v_order.refunded_amount) then
    raise exception 'Requested amount exceeds the refundable balance.';
  end if;

  if length(trim(p_reason)) < 10 or length(trim(p_reason)) > 1000 then
    raise exception 'Refund reason must be between 10 and 1,000 characters.';
  end if;

  if exists (
    select 1 from public.refund_requests
    where order_id = v_order.id
      and status in ('pending', 'processing')
  ) then
    raise exception 'An active refund request already exists.';
  end if;

  insert into public.refund_requests (
    id, order_id, user_id, requested_amount, currency, reason,
    status, created_at, updated_at
  ) values (
    v_request_id, v_order.id, p_user_id, p_requested_amount, v_order.currency,
    trim(p_reason), 'pending', now(), now()
  );

  return v_request_id;
end;
$$;

revoke all on function public.create_refund_request(uuid, uuid, integer, text) from public;
grant execute on function public.create_refund_request(uuid, uuid, integer, text) to service_role;

create or replace function public.begin_refund_request(
  p_refund_request_id uuid,
  p_admin_email text,
  p_approved_amount integer,
  p_admin_note text default null
) returns table(
  refund_request_id uuid,
  order_id uuid,
  payment_intent_id text,
  approved_amount integer,
  currency text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.refund_requests%rowtype;
  v_order public.orders%rowtype;
begin
  select * into v_request
  from public.refund_requests
  where id = p_refund_request_id
  for update;

  if not found then
    raise exception 'Refund request not found.';
  end if;

  if v_request.status <> 'pending' then
    raise exception 'Refund request is no longer pending.';
  end if;

  select * into v_order
  from public.orders
  where id = v_request.order_id
  for update;

  if v_order.status not in ('paid', 'partially_refunded')
    or v_order.amount is null
    or v_order.stripe_payment_intent_id is null then
    raise exception 'Order is not eligible for a refund.';
  end if;

  if p_approved_amount <= 0
    or p_approved_amount > (v_order.amount - v_order.refunded_amount) then
    raise exception 'Approved amount exceeds the refundable balance.';
  end if;

  update public.refund_requests
  set approved_amount = p_approved_amount,
      admin_note = nullif(trim(p_admin_note), ''),
      status = 'processing',
      reviewed_by = p_admin_email,
      reviewed_at = now(),
      failure_reason = null,
      updated_at = now()
  where id = v_request.id;

  return query select
    v_request.id,
    v_order.id,
    v_order.stripe_payment_intent_id,
    p_approved_amount,
    v_order.currency;
end;
$$;

revoke all on function public.begin_refund_request(uuid, text, integer, text) from public;
grant execute on function public.begin_refund_request(uuid, text, integer, text) to service_role;

create or replace function public.sync_stripe_refund(
  p_refund_request_id uuid,
  p_stripe_refund_id text,
  p_payment_intent_id text,
  p_amount integer,
  p_currency text,
  p_stripe_status text,
  p_failure_reason text,
  p_event_created bigint,
  p_raw_payload jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_request_id uuid;
  v_status text;
begin
  select * into v_order
  from public.orders
  where stripe_payment_intent_id = p_payment_intent_id;

  if not found then
    return null;
  end if;

  if p_stripe_status = 'succeeded' then
    v_status := 'succeeded';
  elsif p_stripe_status in ('failed', 'canceled') then
    v_status := 'failed';
  else
    v_status := 'processing';
  end if;

  if p_refund_request_id is not null then
    select id into v_request_id
    from public.refund_requests
    where id = p_refund_request_id
      and order_id = v_order.id;
  end if;

  if v_request_id is null then
    select id into v_request_id
    from public.refund_requests
    where stripe_refund_id = p_stripe_refund_id;
  end if;

  if v_request_id is null then
    select id into v_request_id
    from public.refund_requests
    where order_id = v_order.id
      and status in ('pending', 'processing')
    order by created_at desc
    limit 1;
  end if;

  if v_request_id is null then
    v_request_id := gen_random_uuid();
    insert into public.refund_requests (
      id, order_id, user_id, requested_amount, approved_amount, currency,
      reason, admin_note, status, stripe_refund_id, stripe_status,
      failure_reason, reviewed_by, reviewed_at, completed_at, raw_payload,
      last_stripe_event_created, created_at, updated_at
    ) values (
      v_request_id, v_order.id, v_order.user_id, p_amount, p_amount, p_currency,
      'Refund created directly in Stripe', 'Imported from Stripe webhook', v_status,
      p_stripe_refund_id, p_stripe_status, p_failure_reason, 'stripe', now(),
      case when v_status in ('succeeded', 'failed') then now() else null end,
      p_raw_payload, p_event_created, now(), now()
    );
  else
    update public.refund_requests
    set approved_amount = p_amount,
        currency = p_currency,
        status = case
          when status in ('succeeded', 'failed') and v_status = 'processing' then status
          else v_status
        end,
        stripe_refund_id = p_stripe_refund_id,
        stripe_status = p_stripe_status,
        failure_reason = p_failure_reason,
        reviewed_by = coalesce(reviewed_by, 'stripe'),
        reviewed_at = coalesce(reviewed_at, now()),
        completed_at = case
          when v_status in ('succeeded', 'failed') then coalesce(completed_at, now())
          else completed_at
        end,
        raw_payload = p_raw_payload,
        last_stripe_event_created = greatest(coalesce(last_stripe_event_created, 0), p_event_created),
        updated_at = now()
    where id = v_request_id
      and (last_stripe_event_created is null or last_stripe_event_created <= p_event_created);
  end if;

  return v_request_id;
end;
$$;

revoke all on function public.sync_stripe_refund(uuid, text, text, integer, text, text, text, bigint, jsonb) from public;
grant execute on function public.sync_stripe_refund(uuid, text, text, integer, text, text, text, bigint, jsonb) to service_role;

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
begin
  select * into v_order
  from public.orders
  where stripe_payment_intent_id = p_payment_intent_id
  for update;

  if not found then
    return null;
  end if;

  if v_order.amount is null then
    raise exception 'Paid order amount is missing.';
  end if;

  v_total := greatest(0, least(p_refunded_amount, v_order.amount));
  v_fully_refunded := v_total >= v_order.amount;

  update public.orders
  set refunded_amount = v_total,
      status = case
        when v_fully_refunded then 'refunded'
        when v_total > 0 then 'partially_refunded'
        else 'paid'
      end,
      updated_at = now()
  where id = v_order.id;

  update public.payments
  set refunded_amount = v_total,
      status = case
        when v_fully_refunded then 'refunded'
        when v_total > 0 then 'partially_refunded'
        else 'succeeded'
      end
  where provider = 'stripe'
    and provider_payment_id = p_payment_intent_id;

  if v_fully_refunded then
    update public.applications
    set status = 'canceled', updated_at = now()
    where id = v_order.application_id;
  end if;

  update public.commissions
  set refunded_basis_amount = least(basis_amount, v_total),
      refunded_commission_amount = least(
        commission_amount,
        floor(v_total * rate / 100)::integer
      ),
      status = case
        when v_fully_refunded then 'reversed'
        else status
      end,
      reversed_at = case
        when v_fully_refunded then coalesce(reversed_at, now())
        else reversed_at
      end,
      reversal_reason = case
        when v_fully_refunded then 'payment_refunded'
        when v_total > 0 then 'payment_partially_refunded'
        else reversal_reason
      end,
      updated_at = now()
  where order_id = v_order.id;

  return v_order.id;
end;
$$;

revoke all on function public.sync_charge_refund_totals(text, integer) from public;
grant execute on function public.sync_charge_refund_totals(text, integer) to service_role;
