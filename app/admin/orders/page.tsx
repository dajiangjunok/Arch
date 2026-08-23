import Link from "next/link";
import { AdminShell } from "../_components";
import { requireAdmin } from "@/lib/admin-auth";
import { formatDate, formatMoney, orderStatusLabel, ticketLabel } from "@/lib/format";
import { getApplication, listOrders } from "@/lib/store";

export default async function OrdersPage() {
  await requireAdmin();
  const orders = await listOrders();
  const rows = await Promise.all(
    orders.map(async (order) => ({
      order,
      application: await getApplication(order.applicationId),
    })),
  );

  return (
    <AdminShell title="Orders">
      <section className="mt-8 overflow-hidden border border-line bg-paper">
        {rows.length === 0 ? (
          <p className="p-6 text-sm leading-6 text-ink-soft">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-ink text-paper">
                <tr className="font-mono text-[10px] uppercase tracking-[0.2em]">
                  <th className="px-4 py-4">Applicant</th>
                  <th className="px-4 py-4">Program</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Refunded</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Referral</th>
                  <th className="px-4 py-4">Session</th>
                  <th className="px-4 py-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ order, application }) => (
                  <tr key={order.id} className="border-t border-line align-top">
                    <td className="px-4 py-4">
                      {application ? (
                        <Link
                          href={`/admin/applications/${application.id}`}
                          className="font-bold underline decoration-sun decoration-2 underline-offset-4"
                        >
                          {application.name}
                        </Link>
                      ) : (
                        "Unknown applicant"
                      )}
                    </td>
                    <td className="px-4 py-4">{ticketLabel(order.selectedTicket)}</td>
                    <td className="px-4 py-4">{formatMoney(order.amount, order.currency)}</td>
                    <td className="px-4 py-4">{formatMoney(order.refundedAmount, order.currency)}</td>
                    <td className="px-4 py-4">{orderStatusLabel(order.status)}</td>
                    <td className="px-4 py-4 font-mono text-xs text-ink-soft">{order.referralCode || "-"}</td>
                    <td className="px-4 py-4 break-all font-mono text-xs text-ink-soft">
                      {order.stripeCheckoutSessionId || "-"}
                    </td>
                    <td className="px-4 py-4 text-ink-soft">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
