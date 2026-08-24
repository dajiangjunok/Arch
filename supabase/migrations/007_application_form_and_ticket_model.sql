alter table public.applications
  add column if not exists selected_week text,
  add column if not exists alternate_contact text not null default '',
  add column if not exists additional_info text not null default '';

alter table public.applications
  alter column company set default '',
  alter column title set default '',
  alter column country set default '',
  alter column city set default '';

alter table public.applications
  drop constraint if exists applications_selected_ticket_check,
  drop constraint if exists applications_selected_week_check;

alter table public.orders
  drop constraint if exists orders_selected_ticket_check;

update public.applications
set selected_week = case
  when selected_week in ('week_1', 'week_2', 'week_3') then selected_week
  when selected_ticket in ('single_week_pass', 'week_1') then 'week_1'
  when selected_ticket = 'week_2' then 'week_2'
  when selected_ticket = 'week_3' then 'week_3'
  else null
end;

update public.applications
set selected_ticket = case
  when selected_ticket in ('single_week', 'single_week_pass', 'week_1', 'week_2', 'week_3') then 'single_week'
  else 'fellowship'
end;

update public.orders
set selected_ticket = case
  when selected_ticket in ('single_week', 'single_week_pass', 'week_1', 'week_2', 'week_3') then 'single_week'
  else 'fellowship'
end;

alter table public.applications
  add constraint applications_selected_ticket_check
  check (selected_ticket in ('single_week', 'fellowship')),
  add constraint applications_selected_week_check
  check (
    (selected_ticket = 'single_week' and selected_week in ('week_1', 'week_2', 'week_3'))
    or (selected_ticket = 'fellowship' and selected_week is null)
  );

alter table public.orders
  add constraint orders_selected_ticket_check
  check (selected_ticket in ('single_week', 'fellowship'));
