alter table public.applications
  drop constraint if exists applications_selected_ticket_check;

alter table public.orders
  drop constraint if exists orders_selected_ticket_check;

do $$
begin
  if exists (
    select 1 from public.applications where selected_ticket = 'deposit'
  ) or exists (
    select 1 from public.orders where selected_ticket = 'deposit'
  ) then
    raise exception 'Legacy seat deposit records must be assigned to a current pass before migration.';
  end if;
end
$$;

update public.applications
set selected_ticket = case selected_ticket
  when 'full_program' then 'full_residency'
  when 'week_1' then 'single_week_pass'
  when 'week_2' then 'multi_week_pass'
  when 'week_3' then 'full_residency'
  else selected_ticket
end
where selected_ticket in ('full_program', 'week_1', 'week_2', 'week_3');

update public.orders
set selected_ticket = case selected_ticket
  when 'full_program' then 'full_residency'
  when 'week_1' then 'single_week_pass'
  when 'week_2' then 'multi_week_pass'
  when 'week_3' then 'full_residency'
  else selected_ticket
end
where selected_ticket in ('full_program', 'week_1', 'week_2', 'week_3');

alter table public.applications
  add constraint applications_selected_ticket_check
  check (selected_ticket in ('single_week_pass', 'multi_week_pass', 'full_residency'));

alter table public.orders
  add constraint orders_selected_ticket_check
  check (selected_ticket in ('single_week_pass', 'multi_week_pass', 'full_residency'));
