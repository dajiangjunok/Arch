import Stripe from "stripe";
import { getConfiguredStripePrice, getTicket } from "./tickets";
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

export async function createStripeCheckoutSession(application: Application, order: Order) {
  const stripe = getStripe();
  const ticket = getTicket(order.selectedTicket);
  const stripePriceId = getConfiguredStripePrice(order.selectedTicket);

  if (!stripePriceId && !order.amount) {
    throw new Error(
      `Configure ${ticket.priceEnv} or ${ticket.amountEnv} before creating a checkout session for ${ticket.label}.`,
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_creation: "always",
    customer_email: application.email,
    client_reference_id: order.id,
    success_url: `${getSiteUrl()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getSiteUrl()}/payment/cancel?order_id=${order.id}`,
    metadata: {
      applicationId: application.id,
      orderId: order.id,
      selectedTicket: order.selectedTicket,
      userId: application.userId || "",
      referralId: application.referralId || "",
      referralCode: application.referralCode || "",
      distributorId: application.distributorId || "",
    },
    payment_intent_data: {
      metadata: {
        applicationId: application.id,
        orderId: order.id,
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
              unit_amount: order.amount || undefined,
              product_data: {
                name: `Arch.ai ${ticket.label}`,
                description: ticket.description,
              },
            },
          },
    ],
  });

  return session;
}
