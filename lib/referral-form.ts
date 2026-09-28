import { normalizeReferralCode, type CodeQuote } from "./discounts";

type ReferralFormState = {
  code: string;
  quote: CodeQuote | null;
  distributorId: string | null;
  invitedBy: string;
};

type ReferralFormAction =
  | { type: "edit_code"; code: string }
  | { type: "remove_code" }
  | { type: "verification_started" }
  | { type: "verified"; quote: CodeQuote }
  | { type: "edit_invited_by"; value: string };

export function createReferralFormState(code = ""): ReferralFormState {
  return { code, quote: null, distributorId: null, invitedBy: "" };
}

export function referralFormReducer(state: ReferralFormState, action: ReferralFormAction): ReferralFormState {
  switch (action.type) {
    case "edit_code": {
      const code = action.code.toUpperCase();
      const normalized = normalizeReferralCode(code);
      if (!normalized) return createReferralFormState(code);
      // Keep the inviter draft until a verified code identifies a different partner.
      return { ...state, code, quote: normalized === normalizeReferralCode(state.code) ? state.quote : null };
    }
    case "remove_code":
      return createReferralFormState();
    case "verification_started":
      return { ...state, quote: null };
    case "verified":
      if (action.quote.code !== normalizeReferralCode(state.code)) return state;
      return {
        ...state,
        quote: action.quote,
        distributorId: action.quote.distributorId,
        invitedBy: state.distributorId === action.quote.distributorId ? state.invitedBy : "",
      };
    case "edit_invited_by":
      return { ...state, invitedBy: action.value };
  }
}
