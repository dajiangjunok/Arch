import assert from "node:assert/strict";
import test from "node:test";
import type { CodeQuote } from "../lib/discounts";
import { createReferralFormState, referralFormReducer as reduce } from "../lib/referral-form";

const invite: CodeQuote = {
  code: "AGWN-INVITE", distributorId: "agwn", kind: "referral", selectedTicket: "single_week",
  originalAmount: null, discountAmount: 0, amountDue: null, currency: "usd",
};
const discount: CodeQuote = { ...invite, code: "AGWN-SAVE", kind: "discount", originalAmount: 979900, discountAmount: 129900, amountDue: 850000 };

function filled() {
  const verified = reduce(createReferralFormState(invite.code), { type: "verified", quote: invite });
  return reduce(verified, { type: "edit_invited_by", value: "ABC Community / 김민수" });
}

test("an inviter entered before applying a code survives verification", () => {
  for (const quote of [invite, discount]) {
    let state = reduce(createReferralFormState(), { type: "edit_code", code: quote.code });
    state = reduce(state, { type: "edit_invited_by", value: "ABC Community / 김민수" });
    state = reduce(state, { type: "verification_started" });
    assert.equal(state.invitedBy, "ABC Community / 김민수");
    state = reduce(state, { type: "verified", quote });
    assert.equal(state.invitedBy, "ABC Community / 김민수");
    assert.equal(state.distributorId, quote.distributorId);
  }
});

test("editing the inviter for an unverified replacement code preserves the new value", () => {
  const other = { ...invite, code: "OTHER-INVITE", distributorId: "other" };
  let state = reduce(filled(), { type: "edit_code", code: other.code });
  state = reduce(state, { type: "verification_started" });
  state = reduce(state, { type: "edit_invited_by", value: "New Community" });
  state = reduce(state, { type: "verified", quote: other });
  assert.equal(state.invitedBy, "New Community");
  assert.equal(state.distributorId, "other");
});

test("editing only code casing or surrounding spaces preserves the verified referral and inviter", () => {
  const state = reduce(filled(), { type: "edit_code", code: "  agwn-invite  " });
  assert.equal(state.quote, invite);
  assert.equal(state.invitedBy, "ABC Community / 김민수");
});

test("switching between invite and discount codes for one distributor keeps the inviter", () => {
  let state = filled();
  for (const quote of [discount, invite]) {
    state = reduce(state, { type: "edit_code", code: quote.code });
    assert.equal(state.quote, null);
    state = reduce(state, { type: "verification_started" });
    state = reduce(state, { type: "verified", quote });
    assert.equal(state.invitedBy, "ABC Community / 김민수");
    assert.equal(state.distributorId, "agwn");
  }
});

test("incomplete, invalid or retried verification preserves the draft until a partner is resolved", () => {
  let state = reduce(filled(), { type: "edit_code", code: "INVALID" });
  state = reduce(state, { type: "verification_started" });
  assert.equal(state.quote, null);
  assert.equal(state.invitedBy, "ABC Community / 김민수");
  state = reduce(state, { type: "edit_code", code: invite.code });
  state = reduce(state, { type: "verified", quote: invite });
  state = reduce(state, { type: "verification_started" });
  state = reduce(state, { type: "verified", quote: { ...invite, selectedTicket: "two_weeks" } });
  assert.equal(state.invitedBy, "ABC Community / 김민수");
});

test("verifying a different distributor clears the inviter and returning does not restore it", () => {
  const other = { ...invite, code: "OTHER-INVITE", distributorId: "other" };
  let state = reduce(filled(), { type: "edit_code", code: other.code });
  state = reduce(state, { type: "verified", quote: other });
  assert.equal(state.invitedBy, "");
  assert.equal(state.distributorId, "other");
  state = reduce(state, { type: "edit_code", code: invite.code });
  state = reduce(state, { type: "verified", quote: invite });
  assert.equal(state.invitedBy, "");
});

test("removing or emptying the code clears both the inviter and its distributor", () => {
  for (const action of [{ type: "remove_code" }, { type: "edit_code", code: "" }, { type: "edit_code", code: "   " }] as const) {
    const state = reduce(filled(), action);
    assert.equal(state.invitedBy, "");
    assert.equal(state.distributorId, null);
    assert.equal(state.quote, null);
    const restored = reduce(reduce(state, { type: "edit_code", code: invite.code }), { type: "verified", quote: invite });
    assert.equal(restored.invitedBy, "");
  }
});

test("a late response for a replaced or removed code cannot restore its attribution", () => {
  for (const action of [{ type: "remove_code" }, { type: "edit_code", code: discount.code }] as const) {
    const state = reduce(filled(), action);
    assert.deepEqual(reduce(state, { type: "verified", quote: { ...invite, distributorId: "stale" } }), state);
  }
});
