"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  requireAdmin,
  setAdminSession,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { createStripeCheckoutSession } from "@/lib/stripe";
import {
  createOrderForApplication,
  getApplication,
  recordAdminAuditLog,
  updateApplicationStatus,
  updateOrder,
} from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";

const editableStatuses: ApplicationStatus[] = [
  "pending_review",
  "approved",
  "rejected",
  "more_info_required",
  "payment_sent",
  "paid",
  "confirmed",
  "canceled",
];

function redirectWithMessage(path: string, key: "notice" | "error", message: string): never {
  redirect(`${path}?${key}=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!validateAdminCredentials(email, password)) {
    redirect("/admin/login?error=Invalid%20admin%20credentials%20or%20missing%20ADMIN_EMAIL%2FADMIN_PASSWORD.");
  }

  await setAdminSession(email.trim().toLowerCase());
  redirect("/admin/applications");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateApplicationStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const applicationId = String(formData.get("applicationId") || "");
  const status = String(formData.get("status") || "") as ApplicationStatus;

  if (!applicationId || !editableStatuses.includes(status)) {
    redirectWithMessage("/admin/applications", "error", "Invalid status update.");
  }

  await updateApplicationStatus(applicationId, status);
  await recordAdminAuditLog({
    adminEmail: session.email,
    action: "application.status_updated",
    targetType: "application",
    targetId: applicationId,
    metadata: { status },
  });

  redirectWithMessage(`/admin/applications/${applicationId}`, "notice", "Application status updated.");
}

export async function createCheckoutLinkAction(formData: FormData) {
  const session = await requireAdmin();
  const applicationId = String(formData.get("applicationId") || "");
  const application = await getApplication(applicationId);

  if (!application) {
    redirectWithMessage("/admin/applications", "error", "Application not found.");
  }

  try {
    const order = await createOrderForApplication(application);
    const checkoutSession = await createStripeCheckoutSession(application, order);

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
    await recordAdminAuditLog({
      adminEmail: session.email,
      action: "order.checkout_created",
      targetType: "application",
      targetId: application.id,
      metadata: {
        orderId: order.id,
        checkoutSessionId: checkoutSession.id,
      },
    });
  } catch (error) {
    redirectWithMessage(`/admin/applications/${applicationId}`, "error", (error as Error).message);
  }

  redirectWithMessage(`/admin/applications/${applicationId}`, "notice", "Stripe Checkout link created.");
}
