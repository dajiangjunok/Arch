import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { getStripe, createStripeCheckoutSession, validateDistributorDiscountConfiguration } from "../lib/stripe";
import { getConfiguredTicketAmount, getTicket, ticketOptions } from "../lib/tickets";
import type { Application, Order } from "../lib/types";

const application = { id: "app_test", email: "applicant@example.test", selectedWeeks: ["week_1"], userId: "user_test", referralId: "ref_test", referralCode: "SAVE-TEST", distributorId: "partner_test" } as Application;
const order = { id: "order_test", selectedTicket: "single_week", amount: 850000, currency: "usd", discountCode: "SAVE-TEST", originalAmount: 979900, discountAmount: 129900, amountDue: 850000, pricingCurrency: "usd", stripeCouponId: "coupon_saved", stripeCheckoutSessionId: null } as Order;
const coupon = { id: "coupon_saved", valid: true, amount_off: 129900, currency: "usd", percent_off: null, max_redemptions: null, redeem_by: null };
const price = { id: "price_single", active: true, type: "one_time", unit_amount: 979900, currency: "usd", product: "prod_single" };
const session = { id: "cs_new", status: "open", url: "https://checkout.example.test", currency: "usd", amount_subtotal: 979900, amount_total: 850000, total_details: { amount_discount: 129900 } };
let created: {params: any; options: any}[];
let expired: string[];

beforeEach(() => {
  mock.restoreAll();
  process.env.STRIPE_SECRET_KEY = "sk_test_unit_tests_only";
  process.env.STRIPE_COUPON_DISTRIBUTOR_1299 = "coupon_configured";
  process.env.STRIPE_PRICE_SINGLE_WEEK = "price_single";
  process.env.ARCH_PAYMENT_CURRENCY = "usd";
  process.env.ARCH_TICKET_AMOUNT_SINGLE_WEEK = "979900";
  created = []; expired = [];
  const stripe = getStripe();
  mock.method(stripe.coupons, "retrieve", async () => coupon);
  mock.method(stripe.prices, "retrieve", async () => price);
  mock.method(stripe.checkout.sessions, "retrieve", async () => session);
  mock.method(stripe.checkout.sessions, "create", async (params: any, options: any) => { created.push({params, options}); return session; });
  mock.method(stripe.checkout.sessions, "expire", async (id: string) => { expired.push(id); return {...session, status: "expired"}; });
});

test("configured Stripe Price uses original $9,799 plus exactly one saved $1,299 Coupon", async () => {
  const couponIds: string[] = [];
  mock.method(getStripe().coupons, "retrieve", async (id: string) => { couponIds.push(id); return coupon; });
  const result = await createStripeCheckoutSession(application, order);
  assert.equal(result.amount_total, 850000);
  assert.deepEqual(couponIds, ["coupon_saved"]);
  assert.deepEqual(created[0].params.line_items, [{price: "price_single", quantity: 1}]);
  assert.deepEqual(created[0].params.discounts, [{coupon: "coupon_saved"}]);
  assert.equal(created[0].params.allow_promotion_codes, undefined);
  assert.deepEqual(created[0].params.adaptive_pricing, {enabled: false});
  assert.equal(created[0].params.metadata.distributorId, "partner_test");
  assert.equal(created[0].params.metadata.amountDue, "850000");
});

test("dynamic price_data also uses original price, preventing a second deduction from $8,500", async () => {
  delete process.env.STRIPE_PRICE_SINGLE_WEEK;
  await createStripeCheckoutSession(application, order);
  assert.equal(created[0].params.line_items[0].price_data.unit_amount, 979900);
  assert.equal(created[0].params.line_items[0].price_data.currency, "usd");
});

test("incorrect amounts, currency, subtotal or missing discount expire checkout before exposing a link", async () => {
  for (const mismatch of [
    {amount_total: 979900}, {amount_total: 720100}, {currency: "eur"},
    {amount_subtotal: 850000}, {total_details: {amount_discount: 0}},
  ]) {
    mock.method(getStripe().checkout.sessions, "create", async () => ({...session, ...mismatch}));
    await assert.rejects(createStripeCheckoutSession(application, order), /does not match/);
  }
  assert.equal(expired.length, 5);
});

test("invalid/expiring/limited Coupon configuration and incompatible product prices are rejected", async () => {
  for (const invalid of [{valid: false}, {amount_off: 100}, {currency: "eur"}, {percent_off: 20}, {max_redemptions: 10}, {redeem_by: 2000000000}]) {
    mock.method(getStripe().coupons, "retrieve", async () => ({...coupon, ...invalid}));
    await assert.rejects(validateDistributorDiscountConfiguration(), /Coupon must/);
  }
  mock.method(getStripe().coupons, "retrieve", async () => coupon);
  mock.method(getStripe().prices, "retrieve", async () => ({...price, unit_amount: 850000}));
  await assert.rejects(validateDistributorDiscountConfiguration(), /USD 9,799/);
  mock.method(getStripe().prices, "retrieve", async () => price);
  mock.method(getStripe().coupons, "retrieve", async () => ({...coupon, applies_to: {products: ["prod_other"]}}));
  await assert.rejects(validateDistributorDiscountConfiguration(), /eligible/);
  delete process.env.STRIPE_PRICE_SINGLE_WEEK;
  await assert.rejects(validateDistributorDiscountConfiguration(), /without product restrictions/);
  assert.equal(created.length, 0);
});

test("ordinary referrals create a full-price checkout without a discount Coupon", async () => {
  delete process.env.STRIPE_COUPON_DISTRIBUTOR_1299;
  await createStripeCheckoutSession(application, {...order, discountCode: null, amount: 979900, stripeCouponId: null});
  assert.equal(created[0].params.discounts, undefined);
});

test("each Fellowship duration selects its own Stripe Price and keeps the chosen weeks", async () => {
  for (const ticket of ticketOptions.filter((ticket) => ticket.program === "fellowship")) {
    const amount = { 1: 150000, 2: 240000, 3: 300000 }[ticket.weekCount]!;
    process.env[ticket.priceEnv] = `price_${ticket.id}`;
    process.env[ticket.amountEnv] = String(amount);
    try {
      assert.equal(getConfiguredTicketAmount(ticket.id), amount);
      const selectedWeeks = ticket.weekCount === 1 ? ["week_3"] : ticket.weekCount === 2 ? ["week_1", "week_3"] : ["week_1", "week_2", "week_3"];
      await createStripeCheckoutSession({ ...application, selectedWeeks } as Application, {
        ...order, selectedTicket: ticket.id, amount, discountCode: null, stripeCouponId: null,
      });
      const params = created.at(-1)!.params;
      assert.deepEqual(params.line_items, [{ price: `price_${ticket.id}`, quantity: 1 }]);
      assert.equal(params.metadata.selectedWeeks, selectedWeeks.join(","));
      assert.equal(params.payment_intent_data.metadata.selectedWeeks, selectedWeeks.join(","));
      assert.equal(params.metadata.selectedTicket, ticket.id);
      assert.equal(params.discounts, undefined);
    } finally {
      delete process.env[ticket.priceEnv];
      delete process.env[ticket.amountEnv];
    }
  }
});

test("Fellowship dynamic checkout charges the total package price once", async () => {
  for (const [selectedTicket, amount] of [["fellowship_single_week", 150000], ["fellowship_two_weeks", 240000], ["fellowship_full_program", 300000]] as const) {
    delete process.env[getTicket(selectedTicket).priceEnv];
    await createStripeCheckoutSession(application, { ...order, selectedTicket, amount, discountCode: null, stripeCouponId: null });
    const item = created.at(-1)!.params.line_items[0];
    assert.equal(item.quantity, 1);
    assert.equal(item.price_data.unit_amount, amount);
    assert.equal(item.price_data.currency, "usd");
  }
});

test("unconfigured Fellowship prices report the matching environment variables", async () => {
  delete process.env.STRIPE_PRICE_FELLOWSHIP_TWO_WEEKS;
  await assert.rejects(createStripeCheckoutSession(application, {
    ...order, selectedTicket: "fellowship_two_weeks", amount: null, discountCode: null,
  }), /STRIPE_PRICE_FELLOWSHIP_TWO_WEEKS or ARCH_TICKET_AMOUNT_FELLOWSHIP_TWO_WEEKS/);
  assert.equal(created.length, 0);
});

test("repeated approval shares an idempotency key and an existing open checkout is reused", async () => {
  await createStripeCheckoutSession(application, order);
  await createStripeCheckoutSession(application, order);
  assert.equal(created[0].options.idempotencyKey, created[1].options.idempotencyKey);
  created = [];
  await createStripeCheckoutSession(application, {...order, stripeCheckoutSessionId: "cs_existing"});
  assert.equal(created.length, 0);
  mock.method(getStripe().checkout.sessions, "retrieve", async () => ({...session, status: "expired"}));
  await createStripeCheckoutSession(application, {...order, stripeCheckoutSessionId: "cs_existing"});
  assert.equal(created[0].options.idempotencyKey, "checkout:order_test:cs_existing");
});

test("completed checkouts cannot be replaced while asynchronous payment is processing", async () => {
  mock.method(getStripe().checkout.sessions, "retrieve", async () => ({...session, status: "complete", payment_status: "unpaid", payment_intent: "pi_processing"}));
  mock.method(getStripe().paymentIntents, "retrieve", async () => ({status: "processing"}));
  await assert.rejects(createStripeCheckoutSession(application, {...order, stripeCheckoutSessionId: "cs_existing"}), /still processing/);
  assert.equal(created.length, 0);
});

test("a failed delayed payment is canceled before issuing a replacement checkout", async () => {
  mock.method(getStripe().checkout.sessions, "retrieve", async () => ({...session, status: "complete", payment_status: "unpaid", payment_intent: "pi_failed"}));
  mock.method(getStripe().paymentIntents, "retrieve", async () => ({status: "requires_payment_method"}));
  const canceled: string[] = [];
  mock.method(getStripe().paymentIntents, "cancel", async (id: string) => { canceled.push(id); return {status: "canceled"}; });
  await createStripeCheckoutSession(application, {...order, stripeCheckoutSessionId: "cs_existing"});
  assert.deepEqual(canceled, ["pi_failed"]);
  assert.equal(created.length, 1);
});
