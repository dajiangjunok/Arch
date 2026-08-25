create or replace function public.update_unpaid_application(
  p_application_id uuid,
  p_user_id uuid,
  p_name text,
  p_email text,
  p_alternate_contact text,
  p_message text,
  p_additional_info text
) returns setof public.applications
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.applications as application
  set name = trim(p_name),
      email = lower(trim(p_email)),
      alternate_contact = trim(p_alternate_contact),
      message = trim(p_message),
      additional_info = trim(p_additional_info),
      updated_at = now()
  where application.id = p_application_id
    and application.user_id = p_user_id
    and application.status not in ('paid', 'confirmed')
    and not exists (
      select 1
      from public.orders as application_order
      where application_order.application_id = application.id
        and application_order.status in ('paid', 'partially_refunded', 'refunded')
    )
    and not exists (
      select 1
      from public.orders as application_order
      join public.payments as application_payment on application_payment.order_id = application_order.id
      where application_order.application_id = application.id
        and application_payment.status in ('processing', 'succeeded', 'partially_refunded', 'refunded')
    )
  returning application.*;
end;
$$;

revoke all on function public.update_unpaid_application(uuid, uuid, text, text, text, text, text) from public;
grant execute on function public.update_unpaid_application(uuid, uuid, text, text, text, text, text) to service_role;
