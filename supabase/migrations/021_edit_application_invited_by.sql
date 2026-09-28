-- NULL leaves the inviter unchanged; an explicit empty string clears it.
-- Replace the old signature to avoid ambiguous PostgREST overloads.
drop function public.update_unpaid_application(uuid, uuid, text, text, text, text, text);

create function public.update_unpaid_application(
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
    and application.status not in ('paid', 'rejected', 'canceled')
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

-- Administrators may correct source details after payment. Save the correction
-- and its audit entry together, without changing attribution or payment data.
create function public.admin_update_application_invited_by(
  p_application_id uuid,
  p_invited_by text,
  p_admin_user_id uuid,
  p_admin_email text
) returns setof public.applications
language plpgsql security definer set search_path = public as $$
declare
  v_application public.applications%rowtype;
  v_previous_invited_by text;
  v_invited_by text := nullif(trim(p_invited_by), '');
begin
  if not exists (select 1 from public.user_roles where user_id = p_admin_user_id and role = 'admin') then
    raise exception 'Administrator access is required.';
  end if;
  if char_length(v_invited_by) > 200 then
    raise exception 'Invited by must be 200 characters or fewer.';
  end if;
  select * into v_application from public.applications where id = p_application_id for update;
  if not found then raise exception 'Application not found.'; end if;
  if v_application.distributor_id is null then
    raise exception 'This application has no distributor referral.';
  end if;
  if v_application.invited_by is not distinct from v_invited_by then
    return next v_application;
    return;
  end if;
  v_previous_invited_by := v_application.invited_by;
  update public.applications set invited_by = v_invited_by, updated_at = now()
  where id = p_application_id returning * into v_application;

  insert into public.admin_audit_logs(id, admin_user_id, admin_email, action, target_type, target_id, metadata)
  values (
    gen_random_uuid(), p_admin_user_id, p_admin_email, 'application.invited_by_updated', 'application', p_application_id::text,
    jsonb_build_object('previousInvitedBy', v_previous_invited_by, 'invitedBy', v_invited_by)
  );
  return next v_application;
end;
$$;
revoke all on function public.admin_update_application_invited_by(uuid, text, uuid, text) from public;
grant execute on function public.admin_update_application_invited_by(uuid, text, uuid, text) to service_role;
