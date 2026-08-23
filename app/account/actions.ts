"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { parseMoneyInput } from "@/lib/money";
import { createRefundRequest, getOrder, listRefundRequestsForOrders } from "@/lib/store";

function redirectWithMessage(key: "notice" | "error", message: string): never {
  redirect(`/account?${key}=${encodeURIComponent(message)}`);
}

export async function requestRefundAction(formData: FormData) {
  const user = await requireUser("/account");
  const orderId = String(formData.get("orderId") || "");
  const reason = String(formData.get("reason") || "").trim();
  const order = orderId ? await getOrder(orderId) : null;

  if (!order || order.userId !== user.id) {
    redirectWithMessage("error", "The order could not be found.");
  }

  if (
    !["paid", "partially_refunded"].includes(order.status) ||
    !order.amount ||
    !order.stripePaymentIntentId
  ) {
    redirectWithMessage("error", "This order is not eligible for a refund request.");
  }

  const requestedAmount = parseMoneyInput(String(formData.get("requestedAmount") || ""), order.currency);
  const refundableAmount = order.amount - order.refundedAmount;

  if (!requestedAmount || requestedAmount > refundableAmount) {
    redirectWithMessage("error", "Enter an amount within the remaining refundable balance.");
  }

  if (reason.length < 10 || reason.length > 1000) {
    redirectWithMessage("error", "Provide a refund reason between 10 and 1,000 characters.");
  }

  const activeRequests = (await listRefundRequestsForOrders([order.id])).filter((request) =>
    ["pending", "processing"].includes(request.status),
  );

  if (activeRequests.length > 0) {
    redirectWithMessage("error", "A refund request for this order is already being reviewed.");
  }

  try {
    await createRefundRequest({
      orderId: order.id,
      userId: user.id,
      requestedAmount,
      reason,
    });
  } catch (error) {
    console.error("Unable to create refund request", error);
    redirectWithMessage("error", "The refund request could not be submitted. Please try again.");
  }

  redirectWithMessage("notice", "Your refund request has been submitted for review.");
}
