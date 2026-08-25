alter table public.applications
  drop constraint if exists applications_status_check;

alter table public.applications
  add constraint applications_status_check
  check (status in (
    'pending_review',
    'interview_invited',
    'approved',
    'rejected',
    'more_info_required',
    'payment_sent',
    'paid',
    'confirmed',
    'canceled'
  ));
