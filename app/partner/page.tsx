import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSiteUrl } from "@/lib/stripe";
import {
  applicationStatusLabel,
  formatDate,
  formatMoney,
  orderStatusLabel,
  ticketLabel,
} from "@/lib/format";
import {
  getDistributorForUser,
  listCommissionsForDistributor,
  listReferralCodesForDistributor,
  listReferralsForDistributor,
  getApplication,
  getOrdersForApplication,
} from "@/lib/store";
import { CopyLinkButton } from "./_components/copy-link-button";
import { logoutAction } from "@/app/auth/actions";

export default async function PartnerPage() {
  const user = await requireUser("/partner");
  const distributor = await getDistributorForUser(user.id);

  if (!distributor || distributor.status !== "active") {
    return <PartnerAccessDenied email={user.email || ""} />;
  }

  const [codes, referrals, commissions] = await Promise.all([
    listReferralCodesForDistributor(distributor.id),
    listReferralsForDistributor(distributor.id),
    listCommissionsForDistributor(distributor.id),
  ]);
  const inviteeRows = await Promise.all(
    referrals.map(async (referral) => {
      const application = await getApplication(referral.applicationId);
      const orders = await getOrdersForApplication(referral.applicationId);
      return { referral, application, order: orders[0] || null };
    }),
  );
  const paidCount = inviteeRows.filter((row) =>
    row.order && ["paid", "partially_refunded", "refunded"].includes(row.order.status),
  ).length;
  const pendingCount = inviteeRows.filter((row) => row.application?.status === "pending_review").length;
  const unsettled = commissions.filter((commission) => commission.status === "pending" || commission.status === "approved");
  const unsettledAmount = unsettled.reduce(
    (total, commission) => total + commission.commissionAmount - commission.refundedCommissionAmount,
    0,
  );
  const currency = unsettled[0]?.currency || commissions[0]?.currency || "usd";
  const siteUrl = getSiteUrl();

  return (
    <main className="min-h-screen bg-ivory px-6 py-8 text-ink sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-ink/20 pb-7">
          <div>
            <Link href="/" className="font-serif text-4xl font-black leading-none text-navy sm:text-5xl">The Arch.</Link>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Partner desk · {distributor.name}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/account" className="rounded-md border border-ink/25 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition hover:border-ink hover:bg-card">My account</Link>
            <form action={logoutAction}><button className="rounded-md bg-navy px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory transition hover:bg-marigold hover:text-ink">Sign out</button></form>
          </div>
        </header>

        <section className="py-12 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="arch-eyebrow">Partner network</p>
              <h1 className="mt-4 font-serif text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-none text-navy">Your referrals</h1>
              <span className="title-rule" />
            </div>
            <div className="grid grid-cols-2 gap-px border border-ink/20 bg-ink/20 sm:grid-cols-4">
              <Stat label="Invited" value={referrals.length} />
              <Stat label="Paid" value={paidCount} />
              <Stat label="Pending review" value={pendingCount} />
              <Stat label="To settle" value={formatMoney(unsettledAmount, currency)} />
            </div>
          </div>
        </section>

        <section className="border-t border-ink/20 py-10">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-5">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-navy sm:text-4xl">Invite links</h2>
              <p className="mt-2 text-sm text-ink-soft">Share an active link to attribute new applications to your partner account.</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">{codes.length} codes</span>
          </div>
          {codes.length === 0 ? (
            <p className="border border-dashed border-ink/30 bg-card px-5 py-8 text-sm text-ink-soft">Your partner account does not have an invite code yet. Ask the Arch. team to create one.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {codes.map((code) => {
                const link = `${siteUrl}/r/${encodeURIComponent(code.code)}`;
                return (
                  <article key={code.id} className="border border-ink/20 bg-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">Invite code</p>
                        <h3 className="mt-2 font-serif text-3xl font-semibold text-navy">{code.code}</h3>
                      </div>
                      <span className={`border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] ${code.status === "active" ? "border-navy/25 text-navy" : "border-ink/20 text-ink/45"}`}>{code.status}</span>
                    </div>
                    <p className="mt-5 break-all border border-ink/15 bg-ivory px-3 py-3 font-mono text-xs text-ink/65">{link}</p>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">{code.usedCount} uses</p>
                      {code.status === "active" ? <CopyLinkButton value={link} /> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="border-t border-ink/20 py-10">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-5">
            <h2 className="font-serif text-3xl font-semibold text-navy sm:text-4xl">Invite activity</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Application status only</span>
          </div>
          {inviteeRows.length === 0 ? (
            <p className="border border-dashed border-ink/30 bg-card px-5 py-8 text-sm text-ink-soft">No one has applied through your links yet.</p>
          ) : (
            <div className="overflow-x-auto border border-ink/20 bg-card">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-navy text-ivory">
                  <tr className="font-mono text-[10px] uppercase tracking-[0.16em]"><th className="px-4 py-4">Applicant</th><th className="px-4 py-4">Code</th><th className="px-4 py-4">Program</th><th className="px-4 py-4">Application</th><th className="px-4 py-4">Payment</th><th className="px-4 py-4">Submitted</th></tr>
                </thead>
                <tbody>
                  {inviteeRows.map(({ referral, application, order }) => (
                    <tr key={referral.id} className="border-t border-ink/15 align-top">
                      <td className="px-4 py-4"><p className="font-semibold">{application?.name || "Applicant"}</p><p className="mt-1 text-ink-soft">{application?.company || "-"}</p></td>
                      <td className="px-4 py-4 font-mono text-xs">{referral.codeSnapshot}</td>
                      <td className="px-4 py-4">{application ? ticketLabel(application.selectedTicket) : "-"}</td>
                      <td className="px-4 py-4">{application ? applicationStatusLabel(application.status) : "Unavailable"}</td>
                      <td className="px-4 py-4">{order ? orderStatusLabel(order.status) : "Not created"}</td>
                      <td className="px-4 py-4 text-ink-soft">{formatDate(application?.createdAt || referral.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="min-w-28 bg-card px-4 py-4 text-center"><p className="font-serif text-2xl font-semibold text-navy">{value}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/50">{label}</p></div>;
}

function PartnerAccessDenied({ email }: { email: string }) {
  return (
    <main className="min-h-screen bg-ivory px-6 py-10 text-ink sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[720px]">
        <Link href="/" className="font-serif text-5xl font-black leading-none text-navy">The Arch.</Link>
        <section className="mt-16 border border-ink bg-card p-7 shadow-ink sm:p-10">
          <p className="arch-eyebrow">Partner desk</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-none text-navy">Partner access pending</h1>
          <p className="mt-6 text-sm leading-7 text-ink-soft">The signed-in account {email || "you are using"} is not linked to an active distributor account. Ask the Arch. team to add this email as a partner.</p>
          <Link href="/account" className="mt-7 inline-flex min-h-11 items-center bg-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">Back to account</Link>
        </section>
      </div>
    </main>
  );
}
