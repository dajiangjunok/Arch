import { DISTRIBUTOR_OFFER, ReferralCodeError, normalizeReferralCode, type CodeQuote } from "./discounts";
import { resolveReferralCode } from "./store";
import { validateDistributorDiscountConfiguration } from "./stripe";
import type { TicketId } from "./types";

export async function getApplicationCodeQuote(code: string, selectedTicket: TicketId) {
  const referral = await resolveReferralCode(code);
  let stripeCouponId: string | null = null;
  if (referral.kind === "discount") {
    if (selectedTicket !== "single_week") throw new ReferralCodeError("This discount is only available for the 1 Week program.");
    stripeCouponId = await validateDistributorDiscountConfiguration();
  }
  const quote: CodeQuote = {
    code: normalizeReferralCode(referral.code),
    kind: referral.kind,
    selectedTicket,
    ...(referral.kind === "discount" ? DISTRIBUTOR_OFFER : {
      originalAmount: null, discountAmount: 0, amountDue: null, currency: "usd",
    }),
  };
  return { quote, stripeCouponId };
}
