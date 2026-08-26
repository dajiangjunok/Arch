import Link from "next/link";
import { SubmitButton } from "@/app/_components/submit-button";
import { logoutAction } from "@/app/auth/actions";
import { updateApplicationAction } from "./actions";
import { requireUser } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-auth";
import { getUserIdentity } from "@/lib/user-identity";
import {
  applicationStatusLabel,
  formatDate,
  formatMoney,
  orderStatusLabel,
  paymentStatusLabel,
  programWeeksLabel,
  refundRequestStatusLabel,
  ticketLabel,
} from "@/lib/format";
import type { ApplicationStatus, RefundRequest } from "@/lib/types";
import {
  getDistributorForUser,
  listApplicationsForUser,
  listOrdersForUser,
  listPaymentsForOrders,
  listRefundRequestsForUser,
} from "@/lib/store";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const user = await requireUser("/account");
  const isAdmin = Boolean(await getAdminSession());
  const identity = getUserIdentity(user);
  const query = await searchParams;
  const googleCalendarBookingUrl = process.env.GOOGLE_CALENDAR_BOOKING_URL?.trim();
  const accountData = await loadAccountData(user.id);
  const { applications, orders, distributor, payments, refundRequests } = accountData;
  const applicationsById = new Map(applications.map((application) => [application.id, application]));
  const paymentByOrderId = new Map(payments.map((payment) => [payment.orderId, payment]));
  const ordersByApplicationId = new Map<string, typeof orders>();
  for (const order of orders) {
    const applicationOrders = ordersByApplicationId.get(order.applicationId) || [];
    applicationOrders.push(order);
    ordersByApplicationId.set(order.applicationId, applicationOrders);
  }
  const latestRefundByOrderId = new Map<string, RefundRequest>();
  for (const refundRequest of refundRequests) {
    if (!latestRefundByOrderId.has(refundRequest.orderId)) {
      latestRefundByOrderId.set(refundRequest.orderId, refundRequest);
    }
  }

  return (
    <main className="min-h-screen bg-ivory px-6 py-8 text-ink sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1240px]">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-ink/20 pb-7">
          <div className="flex min-w-0 items-center gap-4">
            <AccountAvatar identity={identity} />
            <div className="min-w-0">
              <Link href="/" className="font-serif text-4xl font-black leading-none text-navy sm:text-5xl">The Arch.</Link>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">{identity.displayName}</p>
              {identity.email ? (
                <p className="mt-1 break-all text-xs text-ink-soft">{identity.email}</p>
              ) : (
                <p className="mt-1 text-xs text-red-800">Google did not provide an email for this account.</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAdmin ? (
              <Link href="/admin" className="rounded-md border border-navy bg-navy px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-marigold hover:text-ink">
                Admin dashboard
              </Link>
            ) : null}
            <Link href="/apply" className="rounded-md bg-marigold px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-navy transition hover:bg-navy hover:text-ivory">
              New application
            </Link>
            {distributor?.status === "active" ? (
              <Link href="/partner" className="rounded-md border border-navy px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-navy transition hover:bg-navy hover:text-ivory">
                Partner desk
              </Link>
            ) : null}
            <form action={logoutAction}>
              <SubmitButton pendingLabel="Signing out..." className="rounded-md border border-ink/25 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition hover:border-ink hover:bg-card">Sign out</SubmitButton>
            </form>
          </div>
        </header>

        <section className="py-12 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="arch-eyebrow">Member record</p>
              <h1 className="mt-4 font-serif text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-none text-navy">My account</h1>
              <span className="title-rule" />
            </div>
            <div className="grid grid-cols-2 gap-px border border-ink/20 bg-ink/20">
              <Stat label="Applications" value={applications.length} />
              <Stat
                label="Payments"
                value={payments.filter((payment) =>
                  ["succeeded", "partially_refunded", "refunded"].includes(payment.status),
                ).length}
              />
            </div>
          </div>
        </section>

        {query.error || query.notice ? (
          <p className={`mb-8 border px-4 py-3 text-sm leading-6 ${query.error ? "border-red-800/30 bg-red-50 text-red-900" : "border-navy/25 bg-card text-navy"}`}>
            {query.error || query.notice}
          </p>
        ) : null}

        <section className="border-t border-ink/20 py-10">
          <div className="mb-7 flex items-baseline justify-between gap-5">
            <h2 className="font-serif text-3xl font-semibold text-navy sm:text-4xl">Payment history</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Stripe secure checkout</span>
          </div>

          {orders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-px border border-ink/20 bg-ink/20">
              {orders.map((order) => {
                const application = applicationsById.get(order.applicationId);
                const payment = paymentByOrderId.get(order.id);
                const latestRefund = latestRefundByOrderId.get(order.id);
                const hasActiveRefund = Boolean(
                  latestRefund && ["pending", "processing"].includes(latestRefund.status),
                );
                const canResume = Boolean(
                  order.checkoutUrl &&
                  order.status === "checkout_created" &&
                  (!order.paymentLinkExpiresAt || new Date(order.paymentLinkExpiresAt) > new Date()),
                );

                return (
                  <article key={order.id} className="grid gap-6 bg-card p-5 sm:p-6 lg:grid-cols-[1fr_0.72fr_auto] lg:items-center">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">{application ? programLabel(application.selectedTicket, application.selectedWeeks) : ticketLabel(order.selectedTicket)}</p>
                      <h3 className="mt-2 font-serif text-2xl font-semibold text-navy">{application?.name || "The Arch. application"}</h3>
                      <p className="mt-2 font-mono text-xs text-ink/50">Submitted {formatDate(application?.createdAt || order.createdAt)}</p>
                    </div>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/45">Amount</dt>
                        <dd className="mt-1 font-semibold">{formatMoney(order.amount, order.currency)}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/45">Payment</dt>
                        <dd className="mt-1 font-semibold">{payment ? paymentStatusLabel(payment.status) : orderStatusLabel(order.status)}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/45">Paid at</dt>
                        <dd className="mt-1">{formatDate(payment?.paidAt || null)}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/45">Application</dt>
                        <dd className="mt-1">{application ? applicationStatusLabel(application.status) : "-"}</dd>
                      </div>
                      {order.refundedAmount > 0 ? (
                        <div>
                          <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/45">Refunded</dt>
                          <dd className="mt-1 font-semibold">{formatMoney(order.refundedAmount, order.currency)}</dd>
                        </div>
                      ) : null}
                    </dl>
                    <div className="grid justify-items-start gap-3 lg:justify-items-end lg:text-right">
                      {canResume ? (
                        <a href={order.checkoutUrl || "#"} className="inline-flex min-h-11 items-center rounded-md bg-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-marigold hover:text-ink">
                          Continue payment
                        </a>
                      ) : (
                        <span className="inline-flex border border-ink/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">{orderStatusLabel(order.status)}</span>
                      )}
                      {latestRefund && hasActiveRefund ? (
                        <div className="max-w-64 text-xs leading-5 text-ink-soft">
                          <p className="font-semibold text-navy">{refundRequestStatusLabel(latestRefund.status)}</p>
                          <p>{formatMoney(latestRefund.requestedAmount, latestRefund.currency)} requested</p>
                        </div>
                      ) : null}
                      {latestRefund && !hasActiveRefund ? (
                        <div className="max-w-64 text-xs leading-5 text-ink-soft">
                          <p>{refundRequestStatusLabel(latestRefund.status)}</p>
                          {latestRefund.adminNote ? <p>{latestRefund.adminNote}</p> : null}
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="border-t border-ink/20 py-10">
          <h2 className="font-serif text-3xl font-semibold text-navy sm:text-4xl">Applications</h2>
          {applications.length === 0 ? (
            <p className="mt-6 text-sm text-ink-soft">No application has been submitted with this account.</p>
          ) : (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {applications.map((application) => {
                const applicationOrders = ordersByApplicationId.get(application.id) || [];
                const canEdit = !(["paid", "rejected", "canceled"] as ApplicationStatus[]).includes(application.status) &&
                  !applicationOrders.some((order) => {
                    const payment = paymentByOrderId.get(order.id);
                    return ["paid", "partially_refunded", "refunded"].includes(order.status) ||
                      Boolean(payment && ["processing", "succeeded", "partially_refunded", "refunded"].includes(payment.status));
                  });

                return (
                  <article key={application.id} className="border border-ink/20 bg-card p-5">
                    <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">{programLabel(application.selectedTicket, application.selectedWeeks)}</p>
                      <h3 className="mt-2 font-serif text-2xl font-semibold text-navy">{application.name}</h3>
                    </div>
                    <span className="border border-ink/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/65">
                      {application.status === "payment_sent"
                        ? "Approved — Awaiting Payment"
                        : applicationStatusLabel(application.status)}
                    </span>
                    </div>
                    <p className="mt-5 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-ink/65">{application.message}</p>
                    {canEdit ? (
                    <details className="mt-5 border-t border-ink/15 pt-5">
                      <summary className="cursor-pointer list-none font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-navy underline decoration-marigold decoration-2 underline-offset-4">
                        Edit application
                      </summary>
                      <p className="mt-3 text-xs leading-5 text-ink-soft">
                        Contact details and written responses can be updated until payment. Program choice and invite code are locked.
                      </p>
                      <form action={updateApplicationAction} className="mt-4 grid gap-4">
                        <input type="hidden" name="applicationId" value={application.id} />
                        <ApplicationInput label="Name" name="name" defaultValue={application.name} maxLength={200} />
                        <ApplicationInput label="Best contact email" name="email" type="email" defaultValue={application.email} maxLength={320} />
                        <ApplicationInput label="Alternate contact" name="alternateContact" defaultValue={application.alternateContact} maxLength={500} />
                        <ApplicationTextarea label="About you and your goals" name="message" defaultValue={application.message} required />
                        <ApplicationTextarea label="Anything else we should know?" name="additionalInfo" defaultValue={application.additionalInfo} />
                        <SubmitButton pendingLabel="Saving..." className="min-h-11 justify-self-start rounded-md bg-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory transition hover:bg-marigold hover:text-ink">
                          Save changes
                        </SubmitButton>
                      </form>
                    </details>
                    ) : (
                    <p className="mt-5 border-t border-ink/15 pt-4 text-xs leading-5 text-ink-soft">
                      {application.status === "rejected"
                        ? "This application is closed and can no longer be edited."
                        : application.status === "canceled"
                          ? "This application has been canceled and can no longer be edited."
                          : "Application details are locked after payment."}
                    </p>
                    )}
                    <ApplicationNextStep
                      status={application.status}
                      googleCalendarBookingUrl={googleCalendarBookingUrl}
                    />
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">{formatDate(application.createdAt)}</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ApplicationNextStep({
  status,
  googleCalendarBookingUrl,
}: {
  status: ApplicationStatus;
  googleCalendarBookingUrl?: string;
}) {
  if (status === "interview_invited") {
    return (
      <div className="mt-5 border-t border-ink/15 pt-5">
        <p className="text-sm leading-6 text-ink/70">
          You have been invited to an interview. Choose a convenient meeting time to continue your application.
        </p>
        {googleCalendarBookingUrl ? (
          <a
            href={googleCalendarBookingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-11 items-center rounded-md bg-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-marigold hover:text-ink"
          >
            Schedule interview
          </a>
        ) : (
          <p className="mt-3 text-xs leading-5 text-ink-soft">
            Scheduling is temporarily unavailable. Please contact the Arch.ai team.
          </p>
        )}
      </div>
    );
  }

  const messages: Partial<Record<ApplicationStatus, string>> = {
    more_info_required: "We need some additional information before continuing. Please update your application and save your changes.",
    interview_scheduled: "Your interview has been scheduled. Please join at the time shown in your Google Calendar invitation.",
    approved: "Your application has been approved. We are preparing your payment link and will make it available here shortly.",
  };
  const message = messages[status];

  return message ? (
    <div className="mt-5 border-t border-ink/15 pt-5">
      <p className="text-sm leading-6 text-ink/70">{message}</p>
    </div>
  ) : null;
}

async function loadAccountData(userId: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await loadAccountDataOnce(userId);
    } catch (error) {
      if (!isJwtIssuedAtFutureError(error) || attempt === 2) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
    }
  }

  return loadAccountDataOnce(userId);
}

async function loadAccountDataOnce(userId: string) {
  const [applications, orders, distributor] = await Promise.all([
    listApplicationsForUser(userId),
    listOrdersForUser(userId),
    getDistributorForUser(userId),
  ]);
  const [payments, refundRequests] = await Promise.all([
    listPaymentsForOrders(orders.map((order) => order.id)),
    listRefundRequestsForUser(userId),
  ]);

  return { applications, orders, distributor, payments, refundRequests };
}

function isJwtIssuedAtFutureError(error: unknown) {
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  return message.includes("JWT issued at future");
}

function programLabel(ticketId: Parameters<typeof ticketLabel>[0], selectedWeeks: Parameters<typeof programWeeksLabel>[0]) {
  return selectedWeeks.length ? `${ticketLabel(ticketId)} · ${programWeeksLabel(selectedWeeks)}` : ticketLabel(ticketId);
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-28 bg-card px-5 py-4 text-center">
      <p className="font-serif text-3xl font-semibold text-navy">{value}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/50">{label}</p>
    </div>
  );
}

function ApplicationInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1 text-xs text-ink-soft">
      {label}
      <input {...props} required className="min-h-11 border border-ink/25 bg-ivory px-3 text-sm text-ink outline-none focus:border-navy" />
    </label>
  );
}

function ApplicationTextarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="grid gap-1 text-xs text-ink-soft">
      {label}
      <textarea {...props} maxLength={5000} rows={4} className="min-h-24 resize-y border border-ink/25 bg-ivory px-3 py-2 text-sm text-ink outline-none focus:border-navy" />
    </label>
  );
}

function AccountAvatar({ identity }: { identity: ReturnType<typeof getUserIdentity> }) {
  const className = "size-14 shrink-0 rounded-full border border-ink/20 bg-navy object-cover text-ivory shadow-ink";

  if (identity.avatarUrl) {
    return <img src={identity.avatarUrl} alt="" referrerPolicy="no-referrer" className={className} />;
  }

  return (
    <span className={`${className} grid place-items-center font-mono text-base font-semibold`}>
      {identity.initials}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-ink/30 bg-card px-6 py-10">
      <p className="font-serif text-2xl font-semibold text-navy">No payment activity yet.</p>
      <p className="mt-3 max-w-xl text-sm leading-7 text-ink-soft">Payment links appear here after your application has been reviewed and approved.</p>
      <Link href="/apply" className="mt-6 inline-flex rounded-md bg-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">Start application</Link>
    </div>
  );
}
