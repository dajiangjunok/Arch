import type { TicketId } from "./types";

// USD cents. Keep the fixed offer in sync with migration 017.
export const DISTRIBUTOR_OFFER = {
  originalAmount: 979900,
  discountAmount: 129900,
  amountDue: 850000,
  currency: "usd",
} as const;

export type CodeQuote = {
  code: string;
  kind: "referral" | "discount";
  selectedTicket: TicketId;
  originalAmount: number | null;
  discountAmount: number;
  amountDue: number | null;
  currency: string;
};

export class ReferralCodeError extends Error {}

export function normalizeReferralCode(code: string) {
  return code.trim().toUpperCase();
}
