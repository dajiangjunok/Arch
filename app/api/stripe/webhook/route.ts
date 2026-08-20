import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  hasProcessedStripeEvent,
  markOrderPaid,
  markOrderRefundedByPaymentIntent,
  markOrderStatusBySession,
  recordStripeEvent,
} from "@/lib/store";

export const runtime = "nodejs";

function getStringId(value: string | { id: string } | null) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook signature is not configured." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: `Invalid webhook signature: ${(error as Error).message}` }, { status: 400 });
  }

  if (await hasProcessedStripeEvent(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId || session.client_reference_id;

      if (!orderId) {
        return NextResponse.json({ error: "Checkout session is missing order id." }, { status: 400 });
      }

      await markOrderPaid({
        orderId,
        paymentIntentId: getStringId(session.payment_intent),
        customerId: getStringId(session.customer),
        amount: session.amount_total,
        currency: session.currency || "usd",
        rawPayload: event,
      });
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await markOrderStatusBySession(session.id, "expired");
      break;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await markOrderStatusBySession(session.id, "payment_failed");
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = getStringId(charge.payment_intent);
      if (paymentIntentId) {
        await markOrderRefundedByPaymentIntent(paymentIntentId);
      }
      break;
    }
    default:
      break;
  }

  await recordStripeEvent({
    stripeEventId: event.id,
    type: event.type,
    rawPayload: event,
  });

  return NextResponse.json({ received: true });
}
