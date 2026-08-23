import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { formatDate, formatMoney, refundRequestStatusLabel, ticketLabel } from "@/lib/format";
import { moneyInputStep, moneyInputValue } from "@/lib/money";
import { listApplications, listOrders, listRefundRequests } from "@/lib/store";
import { AdminShell, Notice, StatusPill } from "../_components";
import { approveRefundAction, rejectRefundAction } from "../actions";

export default async function RefundsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  await requireAdmin();
  const query = await searchParams;
  const [refundRequests, orders, applications] = await Promise.all([
    listRefundRequests(),
    listOrders(),
    listApplications(),
  ]);
  const orderById = new Map(orders.map((order) => [order.id, order]));
  const applicationById = new Map(applications.map((application) => [application.id, application]));
  const statusPriority = { pending: 0, processing: 1, failed: 2, succeeded: 3, rejected: 4, canceled: 5 };
  refundRequests.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);

  return (
    <AdminShell title="Refunds">
      <Notice notice={query.notice} error={query.error} />

      <section className="grid gap-4 py-8 sm:grid-cols-3">
        <Metric label="Pending review" value={refundRequests.filter((request) => request.status === "pending").length} />
        <Metric label="Processing" value={refundRequests.filter((request) => request.status === "processing").length} />
        <Metric label="Completed" value={refundRequests.filter((request) => request.status === "succeeded").length} />
      </section>

      {refundRequests.length === 0 ? (
        <p className="border border-dashed border-line bg-paper p-6 text-sm text-ink-soft">No refund requests yet.</p>
      ) : (
        <section className="grid gap-4">
          {refundRequests.map((request) => {
            const order = orderById.get(request.orderId);
            const application = order ? applicationById.get(order.applicationId) : null;
            const refundableAmount = order ? Math.max(0, (order.amount || 0) - order.refundedAmount) : 0;

            return (
              <article key={request.id} className="border border-line bg-paper p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusPill>{refundRequestStatusLabel(request.status)}</StatusPill>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                        Requested {formatMoney(request.requestedAmount, request.currency)}
                      </span>
                    </div>
                    <h2 className="mt-4 font-poster text-3xl uppercase tracking-[0.04em]">
                      {application?.name || "Unknown applicant"}
                    </h2>
                    <p className="mt-2 text-sm text-ink-soft">
                      {order ? ticketLabel(order.selectedTicket) : "Order unavailable"}
                      {application ? ` · ${application.email}` : ""}
                    </p>
                    <blockquote className="mt-5 border-l-4 border-sun pl-4 text-sm leading-7">{request.reason}</blockquote>
                    <dl className="mt-5 grid gap-3 text-xs text-ink-soft sm:grid-cols-2">
                      <div><dt className="font-mono uppercase">Order</dt><dd className="mt-1 break-all">{request.orderId}</dd></div>
                      <div><dt className="font-mono uppercase">Submitted</dt><dd className="mt-1">{formatDate(request.createdAt)}</dd></div>
                      <div><dt className="font-mono uppercase">Already refunded</dt><dd className="mt-1">{formatMoney(order?.refundedAmount || 0, request.currency)}</dd></div>
                      <div><dt className="font-mono uppercase">Available</dt><dd className="mt-1">{formatMoney(refundableAmount, request.currency)}</dd></div>
                    </dl>
                    {request.adminNote ? <p className="mt-4 text-sm text-ink-soft">Admin note: {request.adminNote}</p> : null}
                    {request.failureReason ? <p className="mt-2 text-sm text-red-800">Stripe: {request.failureReason}</p> : null}
                    {request.stripeRefundId ? <p className="mt-2 break-all font-mono text-xs text-ink-soft">Stripe refund {request.stripeRefundId}</p> : null}
                  </div>

                  {request.status === "pending" && order ? (
                    <div className="grid content-start gap-4 border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                      <form action={approveRefundAction} className="grid gap-3">
                        <input type="hidden" name="refundRequestId" value={request.id} />
                        <label className="grid gap-1">
                          <span className="label">Approved amount ({request.currency.toUpperCase()})</span>
                          <input
                            className="field"
                            name="approvedAmount"
                            type="number"
                            min={moneyInputStep(request.currency)}
                            max={moneyInputValue(refundableAmount, request.currency)}
                            step={moneyInputStep(request.currency)}
                            defaultValue={moneyInputValue(Math.min(request.requestedAmount, refundableAmount), request.currency)}
                            required
                          />
                        </label>
                        <label className="grid gap-1">
                          <span className="label">Approval note</span>
                          <textarea className="field min-h-24 resize-y py-3" name="adminNote" maxLength={1000} />
                        </label>
                        <button className="button-primary" type="submit" disabled={refundableAmount <= 0}>
                          Approve and refund
                        </button>
                      </form>

                      <form action={rejectRefundAction} className="grid gap-3 border-t border-line pt-4">
                        <input type="hidden" name="refundRequestId" value={request.id} />
                        <label className="grid gap-1">
                          <span className="label">Decline reason</span>
                          <textarea className="field min-h-20 resize-y py-3" name="adminNote" minLength={3} maxLength={1000} required />
                        </label>
                        <button className="border border-line bg-paper px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] hover:border-ink" type="submit">
                          Decline request
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="content-start border-t border-line pt-5 text-sm text-ink-soft lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                      <p>Approved: {request.approvedAmount ? formatMoney(request.approvedAmount, request.currency) : "-"}</p>
                      <p className="mt-2">Reviewed: {formatDate(request.reviewedAt)}</p>
                      <p className="mt-2">Completed: {formatDate(request.completedAt)}</p>
                      {application ? (
                        <Link className="mt-5 inline-flex font-mono text-[10px] font-bold uppercase underline decoration-sun decoration-2 underline-offset-4" href={`/admin/applications/${application.id}`}>
                          Open application
                        </Link>
                      ) : null}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="border border-line bg-paper px-4 py-4"><p className="label">{label}</p><p className="mt-2 font-poster text-3xl">{value}</p></div>;
}
