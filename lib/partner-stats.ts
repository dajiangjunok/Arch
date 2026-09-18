import { getTicket } from "./tickets";
import type { Application, Commission, Order, Referral } from "./types";

type InviteActivity = {
  referral: Pick<Referral, "id">;
  application: Pick<Application, "selectedTicket" | "status"> | null;
  orders: Pick<Order, "referralId" | "selectedTicket" | "status" | "amount" | "refundedAmount">[];
};

type CommissionBalance = Pick<Commission, "commissionModel" | "status" | "commissionAmount" | "currency">;

export type MoneyBalance = { currency: string; amount: number };

export type PartnerProgramStats = {
  invitedCount: number;
  paidCount: number;
  pendingCount: number;
  openBalances: MoneyBalance[];
};

export function getOpenCommissionBalances(commissions: CommissionBalance[], fallbackCurrency: string): MoneyBalance[] {
  const balances = new Map<string, number>();
  for (const commission of commissions) {
    if (commission.status !== "pending" && commission.status !== "approved") continue;
    const currency = commission.currency.toLowerCase();
    balances.set(currency, (balances.get(currency) || 0) + commission.commissionAmount);
  }
  if (balances.size === 0) balances.set(commissions[0]?.currency.toLowerCase() || fallbackCurrency.toLowerCase(), 0);
  return [...balances].sort(([a], [b]) => a.localeCompare(b)).map(([currency, amount]) => ({ currency, amount }));
}

export function getPartnerProgramStats(
  invitees: InviteActivity[],
  commissions: CommissionBalance[],
  fallbackCurrency: string,
): Record<Commission["commissionModel"], PartnerProgramStats> {
  const stats = {
    tiered: { invitedCount: 0, paidCount: 0, pendingCount: 0, openBalances: getOpenCommissionBalances(commissions.filter((entry) => entry.commissionModel === "tiered"), fallbackCurrency) },
    fellowship: { invitedCount: 0, paidCount: 0, pendingCount: 0, openBalances: getOpenCommissionBalances(commissions.filter((entry) => entry.commissionModel === "fellowship"), fallbackCurrency) },
  };

  for (const { referral, application, orders } of invitees) {
    const ticket = application?.selectedTicket ?? orders[0]?.selectedTicket;
    if (ticket) {
      const program = stats[getTicket(ticket).program === "fellowship" ? "fellowship" : "tiered"];
      program.invitedCount += 1;
      if (application?.status === "pending_review") program.pendingCount += 1;
    }

    // Count a referral once per program, including earlier paid orders when a
    // more recent checkout failed. Match the commission ledger's refund rules.
    const paidPrograms = new Set<Commission["commissionModel"]>();
    for (const order of orders) {
      if (order.referralId !== referral.id
        || (order.status !== "paid" && order.status !== "partially_refunded")
        || (order.amount ?? 0) <= order.refundedAmount) continue;
      paidPrograms.add(getTicket(order.selectedTicket).program === "fellowship" ? "fellowship" : "tiered");
    }
    for (const program of paidPrograms) stats[program].paidCount += 1;
  }

  return stats;
}
