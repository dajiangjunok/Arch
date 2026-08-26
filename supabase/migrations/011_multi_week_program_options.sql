alter table public.applications
  add column if not exists selected_weeks text[] not null default '{}';

-- Remove the legacy constraints before translating old ticket values. This also
-- makes the migration safe to rerun if an earlier attempt stopped partway through.
alter table public.applications
  drop constraint if exists applications_selected_ticket_check,
  drop constraint if exists applications_selected_week_check,
  drop constraint if exists applications_selected_weeks_check,
  drop constraint if exists applications_selected_weeks_values_check;

alter table public.orders
  drop constraint if exists orders_selected_ticket_check;

update public.applications
set selected_weeks = case
  when selected_ticket = 'single_week' and selected_week in ('week_1', 'week_2', 'week_3') then array[selected_week]
  when selected_ticket = 'fellowship' then array['week_1', 'week_2', 'week_3']
  else selected_weeks
end;

update public.applications
set selected_ticket = 'full_program'
where selected_ticket = 'fellowship';

update public.orders
set selected_ticket = 'full_program'
where selected_ticket = 'fellowship';

alter table public.applications
  add constraint applications_selected_ticket_check
    check (selected_ticket in ('single_week', 'two_weeks', 'full_program')),
  add constraint applications_selected_weeks_check check (
    (selected_ticket = 'single_week' and cardinality(selected_weeks) = 1)
    or (selected_ticket = 'two_weeks' and cardinality(selected_weeks) = 2)
    or (selected_ticket = 'full_program' and selected_weeks = array['week_1', 'week_2', 'week_3'])
  ),
  add constraint applications_selected_weeks_values_check
    check (selected_weeks <@ array['week_1', 'week_2', 'week_3']);

alter table public.orders
  add constraint orders_selected_ticket_check
    check (selected_ticket in ('single_week', 'two_weeks', 'full_program'));

alter table public.applications drop column if exists selected_week;
