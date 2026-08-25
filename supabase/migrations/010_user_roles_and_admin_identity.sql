create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

-- Roles are only read by trusted server code after Supabase authentication.
revoke all on table public.user_roles from anon, authenticated;
grant select on table public.user_roles to service_role;

alter table public.admin_audit_logs
  add column if not exists admin_user_id uuid references auth.users(id) on delete set null;

create index if not exists admin_audit_logs_admin_user_id_idx
  on public.admin_audit_logs(admin_user_id, created_at desc);

create index if not exists admin_audit_logs_created_at_idx
  on public.admin_audit_logs(created_at desc);
