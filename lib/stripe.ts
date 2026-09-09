import Stripe from "stripe";
import { getConfiguredStripePrice, getConfiguredTicketAmount, getCurrency, getTicket } from "./tickets";
import { DISTRIBUTOR_OFFER } from "./discounts";
import type { Application, Order } from "./types";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function validateDistributorDiscountConfiguration(
  couponId = process.env.STRIPE_COUPON_DISTRIBUTOR_1299?.trim(),
) {
  if (!couponId) throw new Error("Configure STRIPE_COUPON_DISTRIBUTOR_1299 before enabling discounts.");
  const stripe = getStripe();
  const coupon = await stripe.coupons.retrieve(couponId);
  if (!coupon.valid || coupon.amount_off !== DISTRIBUTOR_OFFER.discountAmount || coupon.currency !== "usd"
    || coupon.percent_off !== null || coupon.max_redemptions !== null || coupon.redeem_by !== null) {
    throw new Error("The distributor Coupon must be a valid, unlimited USD 1,299 amount-off coupon without an expiry date.");
  }
  const priceId = getConfiguredStripePrice("single_week");
  if (priceId) {
    const price = await stripe.prices.retrieve(priceId);
    const productId = typeof price.product === "string" ? price.product : price.product.id;
    if (!price.active || price.type !== "one_time" || price.currency !== "usd"
      || price.unit_amount !== DISTRIBUTOR_OFFER.originalAmount
      || (coupon.applies_to?.products?.length && !coupon.applies_to.products.includes(productId))) {
      throw new Error("STRIPE_PRICE_SINGLE_WEEK must be an active USD 9,799 one-time price eligible for the distributor Coupon.");
    }
  } else if (getCurrency() !== "usd" || getConfiguredTicketAmount("single_week") !== DISTRIBUTOR_OFFER.originalAmount
    || coupon.applies_to?.products?.length) {
    throw new Error("Dynamic discount pricing requires ARCH_PAYMENT_CURRENCY=usd, ARCH_TICKET_AMOUNT_SINGLE_WEEK=979900, and a Coupon without product restrictions.");
  }
  return couponId;
}

export function assertDiscountCheckout(order: Order, session: Stripe.Checkout.Session) {
  if (!order.discountCode) return;
  if (session.currency !== order.pricingCurrency || session.amount_subtotal !== order.originalAmount
    || session.total_details?.amount_discount !== order.discountAmount || session.amount_total !== order.amountDue) {
    throw new Error("Stripe checkout does not match the saved discount price.");
  }
}

export async function createStripeCheckoutSession(application: Application, order: Order) {
  const stripe = getStripe();
  const ticket = getTicket(order.selectedTicket);
  const stripePriceId = getConfiguredStripePrice(order.selectedTicket);

  if (!stripePriceId && !order.amount) {
    throw new Error(
      `Configure ${ticket.priceEnv} or ${ticket.amountEnv} before creating a checkout session for ${ticket.label}.`,
    );
  }

  if (order.discountCode) {
    if (order.selectedTicket !== "single_week" || order.amountDue !== DISTRIBUTOR_OFFER.amountDue
      || order.originalAmount !== DISTRIBUTOR_OFFER.originalAmount || order.discountAmount !== DISTRIBUTOR_OFFER.discountAmount
      || order.pricingCurrency !== "usd" || !order.stripeCouponId) throw new Error("Invalid saved discount price.");
    await validateDistributorDiscountConfiguration(order.stripeCouponId);
  }

  // Reuse an existing live session. A completed asynchronous checkout must not
  // be replaced while its payment is still processing.
  if (order.stripeCheckoutSessionId) {
    const previous = await stripe.checkout.sessions.retrieve(order.stripeCheckoutSessionId);
    assertDiscountCheckout(order, previous);
    if (previous.status === "open") return previous;
    if (previous.status === "complete") {
      const intentId = typeof previous.payment_intent === "string" ? previous.payment_intent : previous.payment_intent?.id;
      if (previous.payment_status === "paid" || !intentId) throw new Error("This checkout has already been completed. Wait for payment confirmation.");
      const intent = await stripe.paymentIntents.retrieve(intentId);
      if (!["requires_payment_method", "canceled"].includes(intent.status)) {
        throw new Error("Payment is still processing. Wait for payment confirmation before creating another link.");
      }
      // A failed delayed payment may be retried, but its old intent must no
      // longer be chargeable when a replacement checkout becomes available.
      if (intent.status !== "canceled") await stripe.paymentIntents.cancel(intentId);
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    ...(order.discountCode ? {
      discounts: [{ coupon: order.stripeCouponId! }],
      adaptive_pricing: { enabled: false },
    } : {}),
    customer_creation: "always",
    customer_email: application.email,
    client_reference_id: order.id,
    success_url: `${getSiteUrl()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getSiteUrl()}/payment/cancel?order_id=${order.id}`,
    metadata: {
      applicationId: application.id,
      orderId: order.id,
      selectedTicket: order.selectedTicket,
      selectedWeeks: application.selectedWeeks.join(","),
      userId: application.userId || "",
      referralId: application.referralId || "",
      referralCode: application.referralCode || "",
      distributorId: application.distributorId || "",
      discountCode: order.discountCode || "",
      originalAmount: String(order.originalAmount ?? ""),
      discountAmount: String(order.discountAmount),
      amountDue: String(order.amountDue ?? ""),
    },
    payment_intent_data: {
      metadata: {
        applicationId: application.id,
        orderId: order.id,
        selectedTicket: order.selectedTicket,
        selectedWeeks: application.selectedWeeks.join(","),
        userId: application.userId || "",
        referralId: application.referralId || "",
        referralCode: application.referralCode || "",
        distributorId: application.distributorId || "",
      },
    },
    line_items: [
      stripePriceId
        ? {
            price: stripePriceId,
            quantity: 1,
          }
        : {
            quantity: 1,
            price_data: {
              currency: order.currency,
              unit_amount: (order.discountCode ? order.originalAmount : order.amount) || undefined,
              product_data: {
                name: `Arch.ai ${ticket.label}`,
                description: ticket.description,
              },
            },
          },
    ],
  }, {
    idempotencyKey: `checkout:${order.id}:${order.stripeCheckoutSessionId || "initial"}`,
  });

  try {
    assertDiscountCheckout(order, session);
  } catch (error) {
    await stripe.checkout.sessions.expire(session.id);
    throw error;
  }
  return session;
}

export async function createStripeRefund(input: {
  paymentIntentId: string;
  amount: number;
  orderId: string;
  refundRequestId: string;
}) {
  return getStripe().refunds.create(
    {
      payment_intent: input.paymentIntentId,
      amount: input.amount,
      reason: "requested_by_customer",
      metadata: {
        orderId: input.orderId,
        refundRequestId: input.refundRequestId,
      },
    },
    {
      idempotencyKey: `refund-request:${input.refundRequestId}`,
    },
  );
}
