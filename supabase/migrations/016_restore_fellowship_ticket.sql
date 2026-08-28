alter table public.applications
  drop constraint if exists applications_selected_ticket_check,
  drop constraint if exists applications_selected_weeks_check;

alter table public.orders
  drop constraint if exists orders_selected_ticket_check;

alter table public.applications
  add constraint applications_selected_ticket_check
    check (selected_ticket in ('single_week', 'two_weeks', 'full_program', 'fellowship')),
  add constraint applications_selected_weeks_check check (
    (selected_ticket = 'single_week' and cardinality(selected_weeks) = 1)
    or (selected_ticket = 'two_weeks' and cardinality(selected_weeks) = 2)
    or (selected_ticket = 'full_program' and selected_weeks = array['week_1', 'week_2', 'week_3'])
    or (selected_ticket = 'fellowship' and cardinality(selected_weeks) = 0)
  );

alter table public.orders
  add constraint orders_selected_ticket_check
    check (selected_ticket in ('single_week', 'two_weeks', 'full_program', 'fellowship'));
