"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createStripeCheckoutSession } from "@/lib/stripe";
import { getApplication, getOrder, updateApplicationStatus, updateOrder } from "@/lib/store";

export async function restartCheckoutAction(formData: FormData) {
  const user = await requireUser("/account");
  const orderId = String(formData.get("orderId") || "");
  const order = await getOrder(orderId);

  if (!order || order.userId !== user.id) {
    redirect(`/account?error=${encodeURIComponent("Order not found.")}`);
  }

  if (order.status === "paid" || order.status === "refunded") {
    redirect(`/account?error=${encodeURIComponent("This order is already complete.")}`);
  }

  if (
    order.status === "checkout_created" &&
    order.checkoutUrl &&
    (!order.paymentLinkExpiresAt || new Date(order.paymentLinkExpiresAt) > new Date())
  ) {
    redirect(order.checkoutUrl);
  }

  const application = await getApplication(order.applicationId);

  if (!application || application.userId !== user.id) {
    redirect(`/account?error=${encodeURIComponent("Application not found.")}`);
  }

  let checkoutUrl: string;

  try {
    const checkoutSession = await createStripeCheckoutSession(application, order);

    if (!checkoutSession.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    await updateOrder(order.id, {
      amount: checkoutSession.amount_total || order.amount,
      currency: checkoutSession.currency || order.currency,
      status: "checkout_created",
      checkoutUrl: checkoutSession.url,
      stripeCheckoutSessionId: checkoutSession.id,
      paymentLinkExpiresAt: checkoutSession.expires_at
        ? new Date(checkoutSession.expires_at * 1000).toISOString()
        : null,
    });
    await updateApplicationStatus(application.id, "payment_sent");
    checkoutUrl = checkoutSession.url;
  } catch (error) {
    console.error("Unable to restart Stripe Checkout", error);
    redirect(`/account?error=${encodeURIComponent("Secure checkout is temporarily unavailable. Please try again.")}`);
  }

  redirect(checkoutUrl);
}
