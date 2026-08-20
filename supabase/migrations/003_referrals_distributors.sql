create table if not exists public.distributors (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  parent_distributor_id uuid references public.distributors(id) on delete set null,
  commission_rate numeric(5, 2) not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (commission_rate >= 0 and commission_rate <= 100)
);

create table if not exists public.referral_codes (
  id uuid primary key,
  code text not null,
  distributor_id uuid not null references public.distributors(id) on delete cascade,
  code_type text not null default 'referral' check (code_type in ('referral', 'admission')),
  auto_approve boolean not null default false,
  stripe_promotion_code_id text,
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (max_uses is null or max_uses > 0),
  check (used_count >= 0)
);

create unique index if not exists referral_codes_code_lower_idx on public.referral_codes (lower(code));
create index if not exists distributors_parent_idx on public.distributors(parent_distributor_id);
create unique index if not exists distributors_user_id_idx on public.distributors(user_id) where user_id is not null;
create index if not exists referral_codes_distributor_idx on public.referral_codes(distributor_id);

alter table public.applications add column if not exists referral_id uuid;
alter table public.applications add column if not exists referral_code text;
alter table public.applications add column if not exists distributor_id uuid;
alter table public.orders add column if not exists referral_id uuid;
alter table public.orders add column if not exists referral_code text;
alter table public.orders add column if not exists distributor_id uuid;

create table if not exists public.referrals (
  id uuid primary key,
  code_id uuid not null references public.referral_codes(id) on delete restrict,
  distributor_id uuid not null references public.distributors(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  application_id uuid not null unique references public.applications(id) on delete cascade,
  code_snapshot text not null,
  attribution_method text not null default 'invite_link',
  created_at timestamptz not null default now(),
  locked_at timestamptz not null default now()
);

create index if not exists referrals_distributor_idx on public.referrals(distributor_id);
create index if not exists referrals_user_idx on public.referrals(user_id);
create index if not exists referrals_application_idx on public.referrals(application_id);

create table if not exists public.commissions (
  id uuid primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  referral_id uuid not null references public.referrals(id) on delete restrict,
  beneficiary_distributor_id uuid not null references public.distributors(id) on delete restrict,
  level integer not null check (level between 1 and 5),
  rate numeric(5, 2) not null check (rate >= 0 and rate <= 100),
  basis_amount integer not null check (basis_amount >= 0),
  commission_amount integer not null check (commission_amount >= 0),
  currency text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'reversed')),
  paid_at timestamptz,
  reversed_at timestamptz,
  reversal_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_id, beneficiary_distributor_id, level)
);

create index if not exists commissions_status_idx on public.commissions(status, created_at desc);
create index if not exists commissions_beneficiary_idx on public.commissions(beneficiary_distributor_id, status);
create index if not exists commissions_order_idx on public.commissions(order_id);

alter table public.distributors enable row level security;
alter table public.referral_codes enable row level security;
alter table public.referrals enable row level security;
alter table public.commissions enable row level security;

create or replace function public.attach_referral_to_application(
  p_application_id uuid,
  p_user_id uuid,
  p_code text
) returns table(referral_id uuid, distributor_id uuid, code_type text, auto_approve boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.referral_codes%rowtype;
  v_referral_id uuid := gen_random_uuid();
begin
  select * into v_code
  from public.referral_codes
  where lower(code) = lower(trim(p_code))
    and status = 'active'
    and (expires_at is null or expires_at > now())
    and (max_uses is null or used_count < max_uses)
  for update;

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
      status = case when v_code.auto_approve then 'approved' else status end,
      updated_at = now()
  where id = p_application_id;

  return query select v_referral_id, v_code.distributor_id, v_code.code_type, v_code.auto_approve;
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
  v_current_distributor_id uuid;
  v_parent_distributor_id uuid;
  v_rate numeric(5, 2);
  v_status text;
  v_level integer := 1;
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

  select distributor_id into v_current_distributor_id
  from public.referrals
  where id = v_referral_id;

  while v_current_distributor_id is not null and v_level <= 2 loop
    select parent_distributor_id, commission_rate, status
    into v_parent_distributor_id, v_rate, v_status
    from public.distributors
    where id = v_current_distributor_id;

    if v_status = 'active' and coalesce(v_rate, 0) > 0 then
      insert into public.commissions (
        id, order_id, referral_id, beneficiary_distributor_id, level,
        rate, basis_amount, commission_amount, currency, status, created_at
      ) values (
        gen_random_uuid(), p_order_id, v_referral_id, v_current_distributor_id, v_level,
        v_rate, coalesce(p_amount, 0), floor(coalesce(p_amount, 0) * v_rate / 100),
        p_currency, 'pending', v_timestamp
      )
      on conflict (order_id, beneficiary_distributor_id, level) do nothing;
    end if;

    select parent_distributor_id into v_parent_distributor_id
    from public.distributors
    where id = v_current_distributor_id;
    v_current_distributor_id := v_parent_distributor_id;
    v_level := v_level + 1;
  end loop;
end;
$$;

revoke all on function public.mark_order_paid(uuid, text, text, integer, text, jsonb) from public;
grant execute on function public.mark_order_paid(uuid, text, text, integer, text, jsonb) to service_role;

create or replace function public.reverse_commissions_for_order(
  p_order_id uuid,
  p_reason text default 'payment_refunded'
) returns void
language sql
security definer
set search_path = public
as $$
  update public.commissions
  set status = 'reversed', reversed_at = now(), reversal_reason = p_reason
  where order_id = p_order_id
    and status in ('pending', 'approved', 'paid');
$$;

revoke all on function public.reverse_commissions_for_order(uuid, text) from public;
grant execute on function public.reverse_commissions_for_order(uuid, text) to service_role;
