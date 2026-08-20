alter table public.distributors
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create unique index if not exists distributors_user_id_idx
  on public.distributors(user_id)
  where user_id is not null;
