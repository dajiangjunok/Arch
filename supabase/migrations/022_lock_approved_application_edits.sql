-- Approval locks the reviewed application, even before checkout is created.
-- Keep the existing RPC signature for account forms and older callers.
create or replace function public.update_unpaid_application(
  p_application_id uuid,
  p_user_id uuid,
  p_name text,
  p_email text,
  p_alternate_contact text,
  p_message text,
  p_additional_info text,
  p_invited_by text default null
) returns setof public.applications
language plpgsql security definer set search_path = public as $$
begin
  if char_length(trim(p_invited_by)) > 200 then
    raise exception 'Invited by must be 200 characters or fewer.';
  end if;
  return query
  update public.applications as application
  set name = trim(p_name),
      email = lower(trim(p_email)),
      alternate_contact = trim(p_alternate_contact),
      message = trim(p_message),
      additional_info = trim(p_additional_info),
      invited_by = case
        when application.distributor_id is null then null
        when p_invited_by is null then application.invited_by
        else nullif(trim(p_invited_by), '')
      end,
      updated_at = now()
  where application.id = p_application_id
    and application.user_id = p_user_id
    and application.status in ('pending_review', 'interview_invited', 'interview_scheduled', 'more_info_required')
    and not exists (
      select 1 from public.orders as application_order
      where application_order.application_id = application.id
        and application_order.status in ('paid', 'partially_refunded', 'refunded')
    )
    and not exists (
      select 1 from public.orders as application_order
      join public.payments as application_payment on application_payment.order_id = application_order.id
      where application_order.application_id = application.id
        and application_payment.status in ('processing', 'succeeded', 'partially_refunded', 'refunded')
    )
  returning application.*;
end;
$$;
revoke all on function public.update_unpaid_application(uuid, uuid, text, text, text, text, text, text) from public;
grant execute on function public.update_unpaid_application(uuid, uuid, text, text, text, text, text, text) to service_role;
