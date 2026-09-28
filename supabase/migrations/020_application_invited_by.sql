-- Optional source detail within the distributor attribution resolved from a code.
alter table public.applications
  add column invited_by text,
  add constraint applications_invited_by_check check (
    invited_by is null or (
      distributor_id is not null and referral_id is not null and referral_code is not null
      and char_length(invited_by) between 1 and 200 and invited_by = trim(invited_by)
    )
  );

create or replace function public.submit_application(
  p_user_id uuid, p_details jsonb, p_code text default '', p_stripe_coupon_id text default null
) returns setof public.applications
language plpgsql security definer set search_path = public as $$
declare
  v_code public.referral_codes%rowtype;
  v_distributor public.distributors%rowtype;
  v_application public.applications%rowtype;
  v_referral_id uuid;
  v_discount boolean := false;
  v_invited_by text;
begin
  if p_user_id is null then raise exception 'A signed-in user is required.'; end if;
  if coalesce(trim(p_code), '') <> '' then
    select * into v_code from public.referral_codes where lower(code) = lower(trim(p_code));
    if not found then raise exception 'This code is invalid or no longer available.'; end if;
    -- Same lock order as administrator actions: distributor, then code.
    select * into v_distributor from public.distributors where id = v_code.distributor_id for share;
    select * into v_code from public.referral_codes where id = v_code.id for update;
    if v_distributor.status <> 'active' or v_code.status <> 'active'
      or (v_code.kind = 'discount' and not v_distributor.discount_enabled) then
      raise exception 'This code is invalid or no longer available.';
    end if;
    v_discount := v_code.kind = 'discount';
    if v_discount and p_details->>'selectedTicket' is distinct from 'single_week' then
      raise exception 'This discount is only available for the 1 Week program.';
    end if;
    if v_discount and coalesce(trim(p_stripe_coupon_id), '') = '' then
      raise exception 'Stripe discount is not configured.';
    end if;
    v_referral_id := gen_random_uuid();
    v_invited_by := nullif(trim(p_details->>'invitedBy'), '');
    if char_length(v_invited_by) > 200 then
      raise exception 'Invited by must be 200 characters or fewer.';
    end if;
  end if;

  insert into public.applications (
    id, user_id, name, email, company, title, country, city, applicant_type,
    selected_ticket, selected_weeks, alternate_contact, message, additional_info, status,
    referral_id, referral_code, distributor_id, invited_by,
    discount_code, original_amount, discount_amount, amount_due, pricing_currency, stripe_coupon_id
  ) values (
    gen_random_uuid(), p_user_id, trim(p_details->>'name'), lower(trim(p_details->>'email')),
    '', '', '', '', 'other', p_details->>'selectedTicket',
    array(select jsonb_array_elements_text(p_details->'selectedWeeks')),
    trim(p_details->>'alternateContact'), trim(p_details->>'message'), coalesce(trim(p_details->>'additionalInfo'), ''),
    'pending_review', v_referral_id, v_code.code, v_code.distributor_id, v_invited_by,
    case when v_discount then v_code.code end,
    case when v_discount then 979900 end, case when v_discount then 129900 else 0 end,
    case when v_discount then 850000 end, case when v_discount then 'usd' end,
    case when v_discount then p_stripe_coupon_id end
  ) returning * into v_application;

  if v_referral_id is not null then
    insert into public.referrals(id, code_id, distributor_id, user_id, application_id, code_snapshot, attribution_method)
    values(v_referral_id, v_code.id, v_code.distributor_id, p_user_id, v_application.id, v_code.code, 'application_code');
    update public.referral_codes set used_count = used_count + 1, updated_at = now() where id = v_code.id;
  end if;
  return next v_application;
end;
$$;
revoke all on function public.submit_application(uuid, jsonb, text, text) from public;
grant execute on function public.submit_application(uuid, jsonb, text, text) to service_role;
