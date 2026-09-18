import assert from "node:assert/strict";
import test from "node:test";
import { getOpenCommissionBalances, getPartnerProgramStats } from "../lib/partner-stats";
import type { Commission, Order, TicketId } from "../lib/types";

type Activity = Parameters<typeof getPartnerProgramStats>[0][number];
type BalanceEntry = Parameters<typeof getOpenCommissionBalances>[0][number];

function invite(id: string, selectedTicket: TicketId, orders: Activity["orders"] = []): Activity {
  return { referral: { id }, application: { selectedTicket, status: "pending_review" }, orders };
}

function payment(referralId: string, selectedTicket: TicketId, overrides: Partial<Activity["orders"][number]> = {}): Activity["orders"][number] {
  return { referralId, selectedTicket, status: "paid", amount: 150000, refundedAmount: 0, ...overrides };
}

function entry(commissionModel: Commission["commissionModel"], commissionAmount: number, status: Commission["status"] = "pending", currency = "usd"): BalanceEntry {
  return { commissionModel, commissionAmount, status, currency };
}

test("both programs have a visible zero balance before the first referral", () => {
  const stats = getPartnerProgramStats([], [], "usd");
  for (const program of [stats.tiered, stats.fellowship]) {
    assert.deepEqual(program, { invitedCount: 0, paidCount: 0, pendingCount: 0, openBalances: [{ currency: "usd", amount: 0 }] });
  }
});

test("all Fellowship durations and historical funded applications stay separate from tier referrals", () => {
  const tickets: TicketId[] = ["single_week", "two_weeks", "full_program", "fellowship_single_week", "fellowship_two_weeks", "fellowship_full_program", "fellowship"];
  const referrals = tickets.map((ticket) => invite(ticket, ticket, ticket === "fellowship" ? [] : [payment(ticket, ticket)]));
  const stats = getPartnerProgramStats(referrals, [], "usd");
  assert.equal(stats.tiered.invitedCount, 3);
  assert.equal(stats.tiered.paidCount, 3);
  assert.equal(stats.tiered.pendingCount, 3);
  assert.equal(stats.fellowship.invitedCount, 4);
  assert.equal(stats.fellowship.paidCount, 3);
  assert.equal(stats.fellowship.pendingCount, 4);

  referrals[3].application!.status = "approved";
  assert.equal(getPartnerProgramStats(referrals, [], "usd").fellowship.pendingCount, 3);
});

test("paid counts include partial refunds but exclude full refunds, zero amounts and unpaid checkouts", () => {
  const states: Partial<Activity["orders"][number]>[] = [
    { status: "paid" },
    { status: "partially_refunded", refundedAmount: 149999 },
    { status: "partially_refunded", refundedAmount: 150000 },
    { status: "refunded", refundedAmount: 150000 },
    { status: "paid", amount: null },
    { status: "paid", amount: 0 },
    ...(["pending", "checkout_created", "payment_failed", "canceled", "expired"] satisfies Order["status"][]).map((status) => ({ status })),
  ];
  const referrals = states.map((state, index) => invite(String(index), "fellowship_single_week", [payment(String(index), "fellowship_single_week", state)]));
  const stats = getPartnerProgramStats(referrals, [], "usd");
  assert.equal(stats.fellowship.paidCount, 2);
  assert.equal(stats.tiered.paidCount, 0);
});

test("earlier successful payments count once per referral and unrelated orders are ignored", () => {
  const referrals = [
    invite("first", "fellowship_two_weeks", [
      payment("first", "fellowship_two_weeks", { status: "payment_failed" }),
      payment("first", "fellowship_two_weeks"),
      payment("first", "fellowship_two_weeks"),
    ]),
    invite("second", "fellowship_single_week", [payment("another-referral", "fellowship_single_week")]),
  ];
  assert.equal(getPartnerProgramStats(referrals, [], "usd").fellowship.paidCount, 1);
});

test("open balances follow each ledger model, retain deductions and keep currencies separate", () => {
  const commissions = [
    entry("tiered", 76500),
    entry("fellowship", 15000),
    entry("fellowship", -5000, "approved"),
    entry("fellowship", 24000, "paid"),
    entry("fellowship", 30000, "reversed"),
    entry("fellowship", -1000, "approved", "eur"),
    entry("fellowship", 2000, "pending", "EUR"),
  ];
  const stats = getPartnerProgramStats([], commissions, "usd");
  assert.deepEqual(stats.tiered.openBalances, [{ currency: "usd", amount: 76500 }]);
  assert.deepEqual(stats.fellowship.openBalances, [{ currency: "eur", amount: 1000 }, { currency: "usd", amount: 10000 }]);
  assert.deepEqual(getOpenCommissionBalances(commissions, "usd"), [{ currency: "eur", amount: 1000 }, { currency: "usd", amount: 86500 }]);
  assert.deepEqual(getOpenCommissionBalances([entry("fellowship", -5000, "approved")], "usd"), [{ currency: "usd", amount: -5000 }]);
});

test("settled commissions show zero open balance in their currency", () => {
  assert.deepEqual(getOpenCommissionBalances([entry("fellowship", 15000, "paid", "eur")], "usd"), [{ currency: "eur", amount: 0 }]);
});
