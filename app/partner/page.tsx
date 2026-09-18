import Link from "next/link";
import type { ReactNode } from "react";
import { SubmitButton } from "@/app/_components/submit-button";
import { requireUser } from "@/lib/auth";
import { getSiteUrl } from "@/lib/stripe";
import {
  applicationStatusLabel,
  formatDate,
  formatMoney,
  orderStatusLabel,
  programWeeksLabel,
  ticketLabel,
} from "@/lib/format";
import {
  getDistributorForUser,
  listDistributorPaidReferralCounts,
  listCommissionsForDistributor,
  listDistributorTiers,
  listReferralCodesForDistributor,
  listReferralsForDistributor,
  getApplication,
  getOrdersForApplication,
} from "@/lib/store";
import { CopyLinkButton } from "./_components/copy-link-button";
import { logoutAction } from "@/app/auth/actions";
import { getUserIdentity } from "@/lib/user-identity";
import { DISTRIBUTOR_OFFER } from "@/lib/discounts";
import { getCurrency, getTicket } from "@/lib/tickets";
import { getPartnerProgramStats, type MoneyBalance } from "@/lib/partner-stats";

export default async function PartnerPage() {
  const user = await requireUser("/partner");
  const identity = getUserIdentity(user);
  const distributor = await getDistributorForUser(user.id);

  if (!distributor || distributor.status !== "active") {
    return <PartnerAccessDenied identity={identity} />;
  }

  const [codes, referrals, commissions, tiers, paidReferralCounts] = await Promise.all([
    listReferralCodesForDistributor(distributor.id),
    listReferralsForDistributor(distributor.id),
    listCommissionsForDistributor(distributor.id),
    listDistributorTiers(),
    listDistributorPaidReferralCounts(),
  ]);
  const inviteeRows = await Promise.all(
    referrals.map(async (referral) => {
      const application = await getApplication(referral.applicationId);
      const orders = await getOrdersForApplication(referral.applicationId);
      return { referral, application, orders, order: orders[0] || null };
    }),
  );
  const paidCount = paidReferralCounts.find((item) => item.distributorId === distributor.id)?.paidReferralCount || 0;
  const currentTier = [...tiers]
    .reverse()
    .find((tier) => paidCount >= tier.minimumReferrals);
  const currency = getCurrency();
  const programStats = getPartnerProgramStats(inviteeRows, commissions, currency);
  const programs = [
    {
      name: "Single Week Access",
      badge: currentTier?.name || "Not qualified",
      rate: currentTier?.commissionRate || 0,
      rateLabel: "Tier commission",
      description: "1, 2 or 3 weeks. Paid referrals count toward your tier and earn its commission rate.",
      stats: { ...programStats.tiered, paidCount },
    },
    {
      name: "Fellowship",
      badge: "Fixed rate",
      rate: 10,
      rateLabel: "Fixed commission",
      description: "Earn a fixed 10% commission on paid referrals.",
      stats: programStats.fellowship,
    },
  ];
  const siteUrl = getSiteUrl();
  const visibleCodes = codes
    .filter((code) => code.kind === "referral" || distributor.discountEnabled)
    .sort((a, b) => Number(a.kind === "discount") - Number(b.kind === "discount"));
  const singleWeekPrice = formatMoney(DISTRIBUTOR_OFFER.originalAmount, DISTRIBUTOR_OFFER.currency);
  const discountPrice = formatMoney(DISTRIBUTOR_OFFER.amountDue, DISTRIBUTOR_OFFER.currency);
  const discountAmount = formatMoney(DISTRIBUTOR_OFFER.discountAmount, DISTRIBUTOR_OFFER.currency);

  return (
    <main className="min-h-screen bg-ivory px-6 py-6 text-ink sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/20 pb-5">
          <div>
            <Link href="/" className="font-serif text-4xl font-black leading-none text-navy sm:text-5xl">The Arch.</Link>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Partner desk · {distributor.name}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/account" className="rounded-md border border-ink/25 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition hover:border-ink hover:bg-card">My account</Link>
            <form action={logoutAction}><SubmitButton pendingLabel="Signing out..." className="rounded-md bg-navy px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory transition hover:bg-marigold hover:text-ink">Sign out</SubmitButton></form>
          </div>
        </header>

        <section className="py-6 sm:py-8">
          <div>
            <p className="arch-eyebrow">Partner network</p>
            <h1 className="mt-3 whitespace-nowrap font-serif text-[clamp(2.35rem,3.5vw,3.25rem)] font-semibold leading-none text-navy">Your referrals</h1>
            <span className="title-rule" />
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {programs.map((program) => (
              <article key={program.name} className="flex min-w-0 flex-col border border-ink/20 bg-card p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">{program.name}</h2>
                  <span className="border border-navy/25 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-navy">{program.badge}</span>
                </div>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{program.description}</p>
                <div className="my-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-serif text-4xl font-semibold text-navy">{program.rate}%</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">{program.rateLabel}</p>
                </div>
                <div className="grid grid-cols-2 gap-px border border-ink/15 bg-ink/15 sm:grid-cols-4">
                  <Stat label="Invited" value={program.stats.invitedCount} />
                  <Stat label={program.name === "Fellowship" ? "Paid referrals" : "Paid toward tier"} value={program.stats.paidCount} />
                  <Stat label="Pending review" value={program.stats.pendingCount} />
                  <Stat label="Open balance" value={<MoneyValues balances={program.stats.openBalances} />} />
                </div>
                {program.stats.invitedCount === 0 ? <p className="mt-3 text-sm text-ink-soft">No {program.name} referrals yet.</p> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-ink/20 py-6 sm:py-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">Choose what to share</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">Your standard invite code and link work with all tickets at their regular prices. Discount invitations apply only to the {singleWeekPrice} Single Week Access 1 Week ticket.</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">{visibleCodes.length} codes</span>
          </div>
          {visibleCodes.length === 0 ? (
            <p className="border border-dashed border-ink/30 bg-card px-4 py-5 text-sm text-ink-soft">Your partner account does not have an invite code yet. Ask the Arch. team to create one.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {visibleCodes.map((code) => {
                const link = `${siteUrl}/r/${encodeURIComponent(code.code)}`;
                const isDiscount = code.kind === "discount";
                return (
                  <article key={code.id} className={`flex min-w-0 flex-col border p-4 sm:p-5 ${isDiscount ? "border-navy/40 bg-marigold/10" : "border-ink/20 bg-card"}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-2xl font-semibold text-navy">{isDiscount ? "Discount invitation" : "Standard invitation"}</h3>
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">{isDiscount ? "Single Week Access · 1 Week only · USD" : "Ticket eligibility"}</p>
                        <p className="mt-1 font-serif text-3xl font-semibold text-navy sm:text-4xl">{isDiscount ? discountPrice : "All tickets"}</p>
                      </div>
                      <span className={`border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] ${code.status === "active" ? "border-navy/25 text-navy" : "border-ink/20 text-ink/45"}`}>{code.status}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-ink-soft">{isDiscount
                      ? `Save ${discountAmount}: ${singleWeekPrice} → ${discountPrice}. This discount code and link apply only to the Single Week Access 1 Week ticket. Multi-week tickets and Fellowship are excluded.`
                      : "This invite code and link record your referral for all Single Week Access and Fellowship tickets, for any duration. Each ticket uses its standard price; no discount is applied."}</p>
                    <div className="mt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">{isDiscount ? "Discount code" : "Invite code"}</p>
                      <p className="mt-1 select-all break-all font-mono text-lg font-semibold text-navy">{code.code}</p>
                    </div>
                    <div className="mt-auto pt-4">
                      <p className="select-all break-all border border-ink/15 bg-ivory px-3 py-2.5 font-mono text-xs text-ink/65">{link}</p>
                      {code.status === "active" ? (
                        <div className="mt-3 flex flex-wrap gap-3">
                          <CopyLinkButton value={link} label={isDiscount ? "Copy discount link" : "Copy invite link"} />
                          <CopyLinkButton value={code.code} label={isDiscount ? "Copy discount code" : "Copy invite code"} />
                        </div>
                      ) : null}
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">{code.usedCount} applications</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="border-t border-ink/20 py-6 sm:py-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">Invite activity</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Applications and payments</span>
          </div>
          {inviteeRows.length === 0 ? (
            <p className="border border-dashed border-ink/30 bg-card px-4 py-5 text-sm text-ink-soft">No one has applied through your links yet.</p>
          ) : (
            <div className="overflow-x-auto border border-ink/20 bg-card">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-navy text-ivory">
                  <tr className="font-mono text-[10px] uppercase tracking-[0.16em]"><th className="px-4 py-3">Applicant</th><th className="px-4 py-3">Code</th><th className="px-4 py-3">Program</th><th className="px-4 py-3">Application</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Program total / paid</th><th className="px-4 py-3">Submitted</th></tr>
                </thead>
                <tbody>
                  {inviteeRows.map(({ referral, application, order }) => (
                    <tr key={referral.id} className="border-t border-ink/15 align-top">
                      <td className="px-4 py-3"><p className="font-semibold">{application?.name || "Applicant"}</p><p className="mt-1 text-ink-soft">{application?.email || "-"}</p></td>
                      <td className="px-4 py-3 font-mono text-xs">{referral.codeSnapshot}</td>
                      <td className="px-4 py-3">{application ? <><p className="font-semibold text-navy">{getTicket(application.selectedTicket).program === "fellowship" ? "Fellowship" : "Single Week Access"}</p><p className="mt-1 text-xs text-ink-soft">{ticketLabel(application.selectedTicket)} · {programWeeksLabel(application.selectedWeeks)}</p></> : "-"}</td>
                      <td className="px-4 py-3">{application ? applicationStatusLabel(application.status) : "Unavailable"}</td>
                      <td className="px-4 py-3">{order ? orderStatusLabel(order.status) : "Not created"}</td>
                      <td className="px-4 py-3">
                        {order ? formatMoney(order.amount, order.currency) : application?.amountDue ? formatMoney(application.amountDue, application.pricingCurrency || "usd") : "Awaiting review"}
                        {application?.discountCode ? <p className="mt-1 text-xs text-ink-soft">$1,299 discount applied</p> : null}
                        {order && order.refundedAmount > 0 ? <p className="mt-1 text-xs text-ink-soft">{formatMoney(order.refundedAmount, order.currency)} refunded</p> : null}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{formatDate(application?.createdAt || referral.createdAt)}</td>
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

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return <div className="min-w-0 bg-card px-2.5 py-2.5 text-center"><p className="break-words font-serif text-lg font-semibold text-navy sm:text-xl">{value}</p><p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-ink/50">{label}</p></div>;
}

function MoneyValues({ balances }: { balances: MoneyBalance[] }) {
  return <>{balances.map(({ currency, amount }) => <span key={currency} className="block">{formatMoney(amount, currency)}</span>)}</>;
}

function PartnerAccessDenied({ identity }: { identity: ReturnType<typeof getUserIdentity> }) {
  const accountLabel = identity.email
    ? `${identity.displayName} (${identity.email})`
    : identity.displayName;

  return (
    <main className="min-h-screen bg-ivory px-6 py-10 text-ink sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[720px]">
        <Link href="/" className="font-serif text-5xl font-black leading-none text-navy">The Arch.</Link>
        <section className="mt-16 border border-ink bg-card p-7 shadow-ink sm:p-10">
          <p className="arch-eyebrow">Partner desk</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-none text-navy">Partner access pending</h1>
          <p className="mt-6 text-sm leading-7 text-ink-soft">The signed-in Google account {accountLabel} is not linked to an active distributor account. Ask the Arch. team to add this user as a partner.</p>
          <Link href="/account" className="mt-7 inline-flex min-h-11 items-center bg-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">Back to account</Link>
        </section>
      </div>
    </main>
  );
}
