import { requireAdmin } from "@/lib/admin-auth";
import { formatDate, formatMoney } from "@/lib/format";
import {
  listAdminUserOptions,
  listCommissions,
  listDistributors,
  listReferralCodes,
  listReferrals,
} from "@/lib/store";
import { AdminShell, Notice, StatusPill } from "../_components";
import {
  createDistributorAction,
  updateCommissionStatusAction,
  updateDistributorStatusAction,
} from "../actions";

export default async function ReferralsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const [users, distributors, codes, referrals, commissions] = await Promise.all([
    listAdminUserOptions(),
    listDistributors(),
    listReferralCodes(),
    listReferrals(),
    listCommissions(),
  ]);
  const distributorById = new Map(distributors.map((item) => [item.id, item]));
  const distributorByUserId = new Map(
    distributors
      .filter((distributor) => distributor.userId)
      .map((distributor) => [distributor.userId, distributor]),
  );
  const distributorEmailSet = new Set(
    distributors
      .map((distributor) => distributor.email?.toLowerCase())
      .filter((email): email is string => Boolean(email)),
  );
  const codesByDistributorId = new Map<string, typeof codes>();

  for (const code of codes) {
    const distributorCodes = codesByDistributorId.get(code.distributorId) || [];
    distributorCodes.push(code);
    codesByDistributorId.set(code.distributorId, distributorCodes);
  }

  const availableUsers = users.filter(
    (user) => !distributorByUserId.has(user.id) && !distributorEmailSet.has(user.email),
  );

  return (
    <AdminShell title="Referral desk">
      <Notice notice={params.notice} error={params.error} />

      <section className="grid gap-4 py-8 sm:grid-cols-4">
        <Metric label="Distributors" value={distributors.length} />
        <Metric label="Active distributors" value={distributors.filter((distributor) => distributor.status === "active").length} />
        <Metric label="Attributions" value={referrals.length} />
        <Metric label="Pending commission" value={formatMoney(totalPending(commissions), "usd")} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <Panel eyebrow="Network" title="Add distributor">
          <form action={createDistributorAction} className="grid gap-3">
            <label className="grid gap-1">
              <span className="label">User</span>
              <select name="userId" className="field" required defaultValue="" disabled={availableUsers.length === 0}>
                <option value="" disabled>
                  {availableUsers.length === 0 ? "No available users" : "Select user"}
                </option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName} - {user.email}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Commission %" name="commissionRate" type="number" min="0" max="100" step="0.01" defaultValue="10" required />
            <button className="button-primary" type="submit" disabled={availableUsers.length === 0}>
              Create distributor
            </button>
          </form>
        </Panel>

        <Panel eyebrow="Access" title="Distributors">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft">
                <tr>
                  <th className="px-3 py-3">User</th>
                  <th className="px-3 py-3">Commission</th>
                  <th className="px-3 py-3">Invite code</th>
                  <th className="px-3 py-3">Uses</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {distributors.map((distributor) => {
                  const distributorCodes = codesByDistributorId.get(distributor.id) || [];
                  const primaryCode = distributorCodes[0];

                  return (
                    <tr key={distributor.id} className="border-t border-line">
                      <td className="px-3 py-3">
                        <p className="font-semibold">{distributor.name}</p>
                        <p className="mt-1 text-xs text-ink-soft">{distributor.email || "No email"}</p>
                        <p className="mt-1 font-mono text-[10px] text-ink-soft">{distributor.userId || "No linked user"}</p>
                      </td>
                      <td className="px-3 py-3">{distributor.commissionRate}%</td>
                      <td className="px-3 py-3">
                        {primaryCode ? (
                          <>
                            <p className="font-mono font-bold">{primaryCode.code}</p>
                            <p className="mt-1 font-mono text-xs text-ink-soft">/r/{primaryCode.code}</p>
                          </>
                        ) : (
                          <span className="text-ink-soft">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {primaryCode ? primaryCode.usedCount : "-"}
                      </td>
                      <td className="px-3 py-3"><StatusPill>{distributor.status}</StatusPill></td>
                      <td className="px-3 py-3">
                        <form action={updateDistributorStatusAction}>
                          <input type="hidden" name="distributorId" value={distributor.id} />
                          <input type="hidden" name="status" value={distributor.status === "active" ? "inactive" : "active"} />
                          <button type="submit" className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-navy underline decoration-sun decoration-2 underline-offset-4">
                            {distributor.status === "active" ? "Disable" : "Enable"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {distributors.length === 0 ? <p className="muted px-3 py-4">No distributors yet.</p> : null}
          </div>
        </Panel>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.25fr]">
        <Panel eyebrow="Attribution" title="Recent referrals">
          <div className="grid gap-3">
            {referrals.length === 0 ? <p className="muted">No referral activity yet.</p> : null}
            {referrals.map((referral) => (
              <div key={referral.id} className="border border-line bg-paper px-4 py-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono font-bold">{referral.codeSnapshot}</p>
                  <span className="font-mono text-[10px] text-ink-soft">{formatDate(referral.createdAt)}</span>
                </div>
                <p className="mt-2 text-ink-soft">{distributorById.get(referral.distributorId)?.name || "Unknown distributor"}</p>
                <p className="mt-1 font-mono text-[10px] text-ink-soft">Application {referral.applicationId}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Settlement" title="Commission ledger">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft">
                <tr><th className="px-3 py-3">Beneficiary</th><th className="px-3 py-3">Level</th><th className="px-3 py-3">Amount</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Action</th></tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className="border-t border-line">
                    <td className="px-3 py-3">{distributorById.get(commission.beneficiaryDistributorId)?.name || "-"}</td>
                    <td className="px-3 py-3">L{commission.level} · {commission.rate}%</td>
                    <td className="px-3 py-3 font-semibold">
                      {formatMoney(commission.commissionAmount - commission.refundedCommissionAmount, commission.currency)}
                      {commission.refundedCommissionAmount > 0 ? (
                        <span className="mt-1 block text-xs font-normal text-ink-soft">
                          {formatMoney(commission.refundedCommissionAmount, commission.currency)} refunded
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3"><StatusPill>{commission.status}</StatusPill></td>
                    <td className="px-3 py-3">
                      {commission.status === "pending" ? <CommissionAction id={commission.id} status="approved" label="Approve" /> : null}
                      {commission.status === "approved" ? <CommissionAction id={commission.id} status="paid" label="Mark paid" /> : null}
                      {commission.status !== "paid" && commission.status !== "reversed" ? <CommissionAction id={commission.id} status="reversed" label="Reverse" /> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {commissions.length === 0 ? <p className="muted px-3 py-4">No commissions yet.</p> : null}
          </div>
        </Panel>
      </section>
    </AdminShell>
  );
}

function totalPending(commissions: Awaited<ReturnType<typeof listCommissions>>) {
  return commissions
    .filter((commission) => commission.status === "pending" || commission.status === "approved")
    .reduce(
      (total, commission) => total + commission.commissionAmount - commission.refundedCommissionAmount,
      0,
    );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="border border-line bg-paper px-4 py-4"><p className="label">{label}</p><p className="mt-2 font-poster text-3xl">{value}</p></div>;
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="border border-ink bg-paper p-5 shadow-[5px_5px_0_rgba(18,18,18,0.12)]"><p className="label">{eyebrow}</p><h2 className="mt-2 font-poster text-3xl uppercase tracking-[0.04em]">{title}</h2><div className="mt-5">{children}</div></section>;
}

function Input({ label, name, type = "text", required = false, defaultValue, placeholder, min, max, step }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string; placeholder?: string; min?: string; max?: string; step?: string }) {
  return <label className="grid gap-1"><span className="label">{label}</span><input className="field" name={name} type={type} required={required} defaultValue={defaultValue} placeholder={placeholder} min={min} max={max} step={step} /></label>;
}

function CommissionAction({ id, status, label }: { id: string; status: "approved" | "paid" | "reversed"; label: string }) {
  return <form action={updateCommissionStatusAction} className="inline-block mr-2"><input type="hidden" name="commissionId" value={id} /><input type="hidden" name="status" value={status} /><button type="submit" className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-navy underline decoration-sun decoration-2 underline-offset-4">{label}</button></form>;
}
