import Link from "next/link";
import { SubmitButton } from "@/app/_components/submit-button";
import { notFound } from "next/navigation";
import { AdminShell, Notice, StatusPill } from "../../_components";
import {
  approveApplicationAction,
  inviteToInterviewAction,
  updateApplicationStatusAction,
} from "../../actions";
import { requireAdmin } from "@/lib/admin-auth";
import {
  applicationStatusLabel,
  formatDate,
  formatMoney,
  orderStatusLabel,
  programWeekLabel,
  ticketLabel,
} from "@/lib/format";
import { getApplication, getOrdersForApplication } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";

const statuses: ApplicationStatus[] = [
  "pending_review",
  "more_info_required",
  "rejected",
  "canceled",
];

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const application = await getApplication(id);

  if (!application) {
    notFound();
  }

  const orders = await getOrdersForApplication(application.id);
  const hasCompletedOrder = orders.some((order) =>
    ["paid", "partially_refunded", "refunded"].includes(order.status),
  );
  const activeOrder = orders.find(
    (order) =>
      order.status === "checkout_created" &&
      order.checkoutUrl &&
      (!order.paymentLinkExpiresAt || new Date(order.paymentLinkExpiresAt) > new Date()),
  );
  const canApprove =
    !hasCompletedOrder &&
    !activeOrder &&
    (["interview_invited", "approved", "payment_sent"] as ApplicationStatus[]).includes(
      application.status,
    );
  const canInviteToInterview = (["pending_review", "more_info_required"] as ApplicationStatus[]).includes(
    application.status,
  );
  const canChangeReviewStatus =
    statuses.includes(application.status) || application.status === "interview_invited";

  return (
    <AdminShell title="Applicant">
      <Notice notice={query.notice} error={query.error} />
      <div className="mt-6">
        <Link
          href="/admin/applications"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] underline decoration-sun decoration-2 underline-offset-4"
        >
          Back to applications
        </Link>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.58fr]">
        <article className="border border-line bg-paper p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-sun">{ticketLabel(application.selectedTicket)}</p>
              <h2 className="mt-3 font-poster text-5xl uppercase leading-none tracking-[0.08em]">
                {application.name}
              </h2>
              <p className="mt-3 text-ink-soft">{application.email}</p>
            </div>
            <StatusPill>{applicationStatusLabel(application.status)}</StatusPill>
          </div>

          <dl className="mt-8 grid gap-px overflow-hidden border border-line bg-line/70 sm:grid-cols-2">
            <Info label="Program" value={ticketLabel(application.selectedTicket)} />
            <Info label="Week" value={programWeekLabel(application.selectedWeek)} />
            <Info label="Alternate contact" value={application.alternateContact} />
            <Info label="Referral code" value={application.referralCode || "None"} />
            <Info label="Distributor" value={application.distributorId || "None"} />
            <Info label="Submitted" value={formatDate(application.createdAt)} />
            <Info label="Updated" value={formatDate(application.updatedAt)} />
          </dl>

          {application.message ? (
            <div className="mt-6 border border-line bg-cloud p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">Background and goals</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{application.message}</p>
            </div>
          ) : null}
          {application.additionalInfo ? (
            <div className="mt-6 border border-line bg-cloud p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">Additional info</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{application.additionalInfo}</p>
            </div>
          ) : null}
        </article>

        <aside className="grid content-start gap-6">
          {canInviteToInterview ? (
            <form action={inviteToInterviewAction} className="border border-ink bg-sun p-5 text-ink">
              <input type="hidden" name="applicationId" value={application.id} />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]">Interview access</p>
              <p className="mt-3 text-sm leading-6">
                Invite the applicant to schedule an interview before making the final payment decision.
              </p>
              <SubmitButton pendingLabel="Inviting..." className="mt-5 min-h-12 w-full bg-ink px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-paper hover:bg-paper hover:text-ink">
                Invite to interview
              </SubmitButton>
            </form>
          ) : null}

          {canApprove ? (
            <form action={approveApplicationAction} className="border border-ink bg-sun p-5 text-ink">
              <input type="hidden" name="applicationId" value={application.id} />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]">Payment access</p>
              <p className="mt-3 text-sm leading-6">
                After the interview, final approval creates a Stripe Checkout link and makes it available in the applicant&apos;s account.
              </p>
              <SubmitButton pendingLabel="Creating payment link..." className="mt-5 min-h-12 w-full bg-ink px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-paper hover:bg-paper hover:text-ink">
                {application.status === "approved" || application.status === "payment_sent"
                  ? "Generate new payment link"
                  : "Final approve and create payment link"}
              </SubmitButton>
            </form>
          ) : activeOrder ? (
            <div className="border border-line bg-paper p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">Payment access</p>
              <p className="mt-3 text-sm leading-6">An active payment link is available to the applicant.</p>
            </div>
          ) : null}

          {canChangeReviewStatus ? (
            <form action={updateApplicationStatusAction} className="border border-line bg-paper p-5">
              <input type="hidden" name="applicationId" value={application.id} />
              <label className="grid gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">
                  Review status
                </span>
                <select
                  name="status"
                  defaultValue={application.status === "interview_invited" ? "" : application.status}
                  className="min-h-12 border border-line bg-cloud px-4 text-sm outline-none focus:border-ink focus:ring-4 focus:ring-sun/25"
                >
                  {application.status === "interview_invited" ? (
                    <option value="" disabled>
                      Select next status
                    </option>
                  ) : null}
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {applicationStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>
              <SubmitButton pendingLabel="Saving..." className="mt-4 min-h-12 w-full bg-ink px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-paper hover:bg-sun hover:text-ink">
                Save review status
              </SubmitButton>
            </form>
          ) : null}
        </aside>
      </section>

      <section className="mt-8 border border-line bg-paper">
        <div className="border-b border-line p-5">
          <h2 className="font-poster text-4xl uppercase tracking-[0.08em]">Orders</h2>
        </div>
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-ink-soft">No orders found for this applicant.</p>
        ) : (
          <div className="grid gap-px bg-line/70">
            {orders.map((order) => (
              <article key={order.id} className="grid gap-4 bg-paper p-5 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusPill>{orderStatusLabel(order.status)}</StatusPill>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                      {formatMoney(order.amount, order.currency)}
                    </span>
                  </div>
                  <p className="mt-3 break-all font-mono text-xs text-ink-soft">Order {order.id}</p>
                  <p className="mt-2 break-all font-mono text-xs text-ink-soft">
                    Stripe Session {order.stripeCheckoutSessionId || "-"}
                  </p>
                  {order.refundedAmount > 0 ? (
                    <p className="mt-2 font-mono text-xs text-ink-soft">
                      Refunded {formatMoney(order.refundedAmount, order.currency)}
                    </p>
                  ) : null}
                  <p className="mt-2 font-mono text-xs text-ink-soft">
                    Referral {order.referralCode || "-"}
                  </p>
                  {order.checkoutUrl ? (
                    <a
                      href={order.checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex break-all font-mono text-[11px] font-bold uppercase tracking-[0.16em] underline decoration-sun decoration-2 underline-offset-4"
                    >
                      Open Checkout link
                    </a>
                  ) : null}
                </div>
                <div className="text-sm leading-6 text-ink-soft lg:text-right">
                  <p>Created {formatDate(order.createdAt)}</p>
                  <p>Expires {formatDate(order.paymentLinkExpiresAt)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cloud p-4">
      <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">{label}</dt>
      <dd className="mt-2 text-sm leading-6">{value}</dd>
    </div>
  );
}
