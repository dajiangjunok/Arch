import Link from "next/link";
import { logoutAction } from "@/app/auth/actions";
import { restartCheckoutAction } from "./actions";
import { requireUser } from "@/lib/auth";
import {
  applicationStatusLabel,
  formatDate,
  formatMoney,
  orderStatusLabel,
  paymentStatusLabel,
  ticketLabel,
} from "@/lib/format";
import { listApplicationsForUser, listOrdersForUser, listPaymentsForOrders } from "@/lib/store";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const user = await requireUser("/account");
  const query = await searchParams;
  const [applications, orders] = await Promise.all([
    listApplicationsForUser(user.id),
    listOrdersForUser(user.id),
  ]);
  const payments = await listPaymentsForOrders(orders.map((order) => order.id));
  const applicationsById = new Map(applications.map((application) => [application.id, application]));
  const paymentByOrderId = new Map(payments.map((payment) => [payment.orderId, payment]));

  return (
    <main className="min-h-screen bg-ivory px-6 py-8 text-ink sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1240px]">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-ink/20 pb-7">
          <div>
            <Link href="/" className="font-serif text-4xl font-black leading-none text-navy sm:text-5xl">The Arch.</Link>
            <p className="mt-3 break-all font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/apply" className="rounded-md bg-marigold px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-navy transition hover:bg-navy hover:text-ivory">
              New application
            </Link>
            <form action={logoutAction}>
              <button className="rounded-md border border-ink/25 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition hover:border-ink hover:bg-card">Sign out</button>
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
              <Stat label="Payments" value={payments.filter((payment) => payment.status === "succeeded").length} />
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
                const canResume = Boolean(
                  order.checkoutUrl &&
                  order.status === "checkout_created" &&
                  (!order.paymentLinkExpiresAt || new Date(order.paymentLinkExpiresAt) > new Date()),
                );
                const canRestart = !payment && !canResume && order.status !== "paid" && order.status !== "refunded";

                return (
                  <article key={order.id} className="grid gap-6 bg-card p-5 sm:p-6 lg:grid-cols-[1fr_0.72fr_auto] lg:items-center">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">{application ? ticketLabel(application.selectedTicket) : ticketLabel(order.selectedTicket)}</p>
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
                    </dl>
                    <div className="lg:text-right">
                      {canResume ? (
                        <a href={order.checkoutUrl || "#"} className="inline-flex min-h-11 items-center rounded-md bg-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-marigold hover:text-ink">
                          Continue payment
                        </a>
                      ) : canRestart ? (
                        <form action={restartCheckoutAction}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <button className="inline-flex min-h-11 items-center rounded-md bg-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-marigold hover:text-ink">
                            Restart checkout
                          </button>
                        </form>
                      ) : (
                        <span className="inline-flex border border-ink/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">{orderStatusLabel(order.status)}</span>
                      )}
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
              {applications.map((application) => (
                <article key={application.id} className="border border-ink/20 bg-card p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">{ticketLabel(application.selectedTicket)}</p>
                      <h3 className="mt-2 font-serif text-2xl font-semibold text-navy">{application.company}</h3>
                    </div>
                    <span className="border border-ink/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/65">{applicationStatusLabel(application.status)}</span>
                  </div>
                  <p className="mt-5 text-sm text-ink/65">{application.title} / {application.city}, {application.country}</p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">{formatDate(application.createdAt)}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-28 bg-card px-5 py-4 text-center">
      <p className="font-serif text-3xl font-semibold text-navy">{value}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/50">{label}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-ink/30 bg-card px-6 py-10">
      <p className="font-serif text-2xl font-semibold text-navy">No payment activity yet.</p>
      <p className="mt-3 max-w-xl text-sm leading-7 text-ink-soft">Submit an application to choose your program and continue directly to Stripe Checkout.</p>
      <Link href="/apply" className="mt-6 inline-flex rounded-md bg-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">Start application</Link>
    </div>
  );
}
