create table if not exists public.applications (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  company text not null,
  title text not null,
  country text not null,
  city text not null,
  applicant_type text not null check (applicant_type in ('founder', 'investor', 'institution', 'partner', 'other')),
  selected_ticket text not null check (selected_ticket in ('single_week_pass', 'multi_week_pass', 'full_residency')),
  message text not null default '',
  status text not null check (status in ('pending_review', 'approved', 'rejected', 'more_info_required', 'payment_sent', 'paid', 'confirmed', 'canceled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete set null,
  application_id uuid not null references public.applications(id) on delete cascade,
  selected_ticket text not null check (selected_ticket in ('single_week_pass', 'multi_week_pass', 'full_residency')),
  amount integer,
  currency text not null,
  status text not null check (status in ('pending', 'checkout_created', 'paid', 'payment_failed', 'canceled', 'refunded', 'expired')),
  checkout_url text,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  stripe_customer_id text,
  payment_link_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null check (provider = 'stripe'),
  provider_payment_id text,
  amount integer,
  currency text not null,
  status text not null check (status in ('processing', 'succeeded', 'failed', 'refunded')),
  paid_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);

create table if not exists public.stripe_events (
  id uuid primary key,
  stripe_event_id text not null unique,
  type text not null,
  processed_at timestamptz not null default now(),
  raw_payload jsonb
);

create table if not exists public.admin_audit_logs (
  id uuid primary key,
  admin_email text not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists applications_user_id_idx on public.applications(user_id);
create index if not exists applications_created_at_idx on public.applications(created_at desc);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_application_id_idx on public.orders(application_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists payments_order_id_idx on public.payments(order_id);

alter table public.applications enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.stripe_events enable row level security;
alter table public.admin_audit_logs enable row level security;

drop policy if exists "Users can read own applications" on public.applications;
create policy "Users can read own applications"
  on public.applications for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create own applications" on public.applications;
create policy "Users can create own applications"
  on public.applications for insert to authenticated
  with check (auth.uid() = user_id and status = 'pending_review');

drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
  on public.orders for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can read payments for own orders" on public.payments;
create policy "Users can read payments for own orders"
  on public.payments for select to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = payments.order_id
        and orders.user_id = auth.uid()
    )
  );

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
  returning application_id into v_application_id;

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
end;
$$;

revoke all on function public.mark_order_paid(uuid, text, text, integer, text, jsonb) from public;
grant execute on function public.mark_order_paid(uuid, text, text, integer, text, jsonb) to service_role;
