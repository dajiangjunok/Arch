import Link from "next/link";
import { AdminShell, Notice, StatusPill } from "../_components";
import { requireAdmin } from "@/lib/admin-auth";
import { applicationStatusLabel, formatDate, programWeekLabel, ticketLabel } from "@/lib/format";
import { listApplications } from "@/lib/store";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const applications = await listApplications();
  const paidCount = applications.filter((application) => application.status === "paid").length;
  const pendingCount = applications.filter((application) => application.status === "pending_review").length;

  return (
    <AdminShell title="Applications">
      <Notice notice={params.notice} error={params.error} />
      <section className="grid gap-px border border-line bg-line/70 sm:grid-cols-3">
        <Metric label="Total" value={applications.length} />
        <Metric label="Pending" value={pendingCount} />
        <Metric label="Paid" value={paidCount} />
      </section>

      <section className="mt-8 overflow-hidden border border-line bg-paper">
        {applications.length === 0 ? (
          <p className="p-6 text-sm leading-6 text-ink-soft">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-ink text-paper">
                <tr className="font-mono text-[10px] uppercase tracking-[0.2em]">
                  <th className="px-4 py-4">Applicant</th>
                  <th className="px-4 py-4">Program</th>
                  <th className="px-4 py-4">Interest</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Submitted</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id} className="border-t border-line align-top">
                    <td className="px-4 py-4">
                      <strong className="block text-base">{application.name}</strong>
                      <span className="text-ink-soft">{application.email}</span>
                    </td>
                    <td className="px-4 py-4">
                      <strong className="block">{ticketLabel(application.selectedTicket)}</strong>
                      <span className="text-ink-soft">{programWeekLabel(application.selectedWeek)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="line-clamp-2 text-ink-soft">{application.message}</span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill>{applicationStatusLabel(application.status)}</StatusPill>
                    </td>
                    <td className="px-4 py-4 text-ink-soft">{formatDate(application.createdAt)}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/applications/${application.id}`}
                        className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink underline decoration-sun decoration-2 underline-offset-4"
                      >
                        Open
                      </Link>
                    </td>
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

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="bg-paper p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">{label}</p>
      <strong className="mt-2 block font-poster text-5xl leading-none tracking-[0.08em]">{value}</strong>
    </article>
  );
}
