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
  createDistributor,
  createReferralCode,
  getApplication,
  getOrdersForApplication,
  recordAdminAuditLog,
  updateCommissionStatus,
  updateApplicationStatus,
  updateReferralCode,
  updateOrder,
} from "@/lib/store";
import type { ApplicationStatus, CommissionStatus, ReferralCodeType } from "@/lib/types";

const editableStatuses: ApplicationStatus[] = [
  "pending_review",
  "rejected",
  "more_info_required",
  "canceled",
];

const approvableStatuses: ApplicationStatus[] = [
  "pending_review",
  "more_info_required",
  "approved",
  "payment_sent",
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

export async function createDistributorAction(formData: FormData) {
  const session = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const parentDistributorId = String(formData.get("parentDistributorId") || "").trim() || null;
  const commissionRate = Number(formData.get("commissionRate") || 0);

  if (!name || !Number.isFinite(commissionRate) || commissionRate < 0 || commissionRate > 100) {
    redirectWithMessage("/admin/referrals", "error", "Enter a distributor name and a commission rate from 0 to 100.");
  }

  const distributor = await createDistributor({ name, email: email || null, parentDistributorId, commissionRate });
  await recordAdminAuditLog({
    adminEmail: session.email,
    action: "distributor.created",
    targetType: "distributor",
    targetId: distributor.id,
    metadata: { name: distributor.name, parentDistributorId, commissionRate },
  });
  redirectWithMessage("/admin/referrals", "notice", "Distributor created.");
}

export async function createReferralCodeAction(formData: FormData) {
  const session = await requireAdmin();
  const code = String(formData.get("code") || "").trim();
  const distributorId = String(formData.get("distributorId") || "").trim();
  const codeType = String(formData.get("codeType") || "referral") as ReferralCodeType;
  const autoApprove = formData.get("autoApprove") === "on";
  const maxUsesValue = String(formData.get("maxUses") || "").trim();
  const expiresAtValue = String(formData.get("expiresAt") || "").trim();
  const maxUses = maxUsesValue ? Number(maxUsesValue) : null;

  if (!code || !distributorId || !["referral", "admission"].includes(codeType)) {
    redirectWithMessage("/admin/referrals", "error", "Enter a code, distributor and valid code type.");
  }

  if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses < 1)) {
    redirectWithMessage("/admin/referrals", "error", "Maximum uses must be a positive whole number.");
  }

  try {
    const referralCode = await createReferralCode({
      code,
      distributorId,
      codeType,
      autoApprove,
      maxUses,
      expiresAt: expiresAtValue ? new Date(expiresAtValue).toISOString() : null,
    });
    await recordAdminAuditLog({
      adminEmail: session.email,
      action: "referral_code.created",
      targetType: "referral_code",
      targetId: referralCode.id,
      metadata: { code: referralCode.code, distributorId, codeType, autoApprove },
    });
  } catch (error) {
    console.error("Unable to create referral code", error);
    redirectWithMessage("/admin/referrals", "error", "The referral code could not be created. It may already exist.");
  }

  redirectWithMessage("/admin/referrals", "notice", "Referral code created.");
}

export async function updateCommissionStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const commissionId = String(formData.get("commissionId") || "");
  const status = String(formData.get("status") || "") as CommissionStatus;

  if (!commissionId || !["pending", "approved", "paid", "reversed"].includes(status)) {
    redirectWithMessage("/admin/referrals", "error", "Invalid commission update.");
  }

  await updateCommissionStatus(commissionId, status);
  await recordAdminAuditLog({
    adminEmail: session.email,
    action: "commission.status_updated",
    targetType: "commission",
    targetId: commissionId,
    metadata: { status },
  });
  redirectWithMessage("/admin/referrals", "notice", "Commission status updated.");
}

export async function updateReferralCodeStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const codeId = String(formData.get("codeId") || "");
  const status = String(formData.get("status") || "") as "active" | "inactive";

  if (!codeId || !["active", "inactive"].includes(status)) {
    redirectWithMessage("/admin/referrals", "error", "Invalid referral code update.");
  }

  await updateReferralCode(codeId, { status });
  await recordAdminAuditLog({
    adminEmail: session.email,
    action: "referral_code.status_updated",
    targetType: "referral_code",
    targetId: codeId,
    metadata: { status },
  });
  redirectWithMessage("/admin/referrals", "notice", "Referral code status updated.");
}

export async function updateApplicationStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const applicationId = String(formData.get("applicationId") || "");
  const status = String(formData.get("status") || "") as ApplicationStatus;

  if (!applicationId || !editableStatuses.includes(status)) {
    redirectWithMessage("/admin/applications", "error", "Invalid status update.");
  }

  const application = await getApplication(applicationId);

  if (!application || !editableStatuses.includes(application.status)) {
    redirectWithMessage(
      application ? `/admin/applications/${applicationId}` : "/admin/applications",
      "error",
      "The review status can no longer be changed for this application.",
    );
  }

  await updateApplicationStatus(applicationId, status);
  await recordAdminAuditLog({
    adminEmail: session.email,
    action: "application.status_updated",
    targetType: "application",
    targetId: applicationId,
    metadata: { previousStatus: application.status, status },
  });

  redirectWithMessage(`/admin/applications/${applicationId}`, "notice", "Application status updated.");
}

export async function approveApplicationAction(formData: FormData) {
  const session = await requireAdmin();
  const applicationId = String(formData.get("applicationId") || "");
  const application = applicationId ? await getApplication(applicationId) : null;

  if (!application || !approvableStatuses.includes(application.status)) {
    redirectWithMessage(
      applicationId ? `/admin/applications/${applicationId}` : "/admin/applications",
      "error",
      "This application cannot be approved for payment.",
    );
  }

  const orders = await getOrdersForApplication(application.id);
  const paidOrder = orders.find((order) => order.status === "paid" || order.status === "refunded");

  if (paidOrder) {
    redirectWithMessage(
      `/admin/applications/${application.id}`,
      "error",
      "This application already has a completed payment.",
    );
  }

  const activeOrder = orders.find(
    (order) =>
      order.status === "checkout_created" &&
      order.checkoutUrl &&
      (!order.paymentLinkExpiresAt || new Date(order.paymentLinkExpiresAt) > new Date()),
  );

  if (activeOrder) {
    if (application.status !== "payment_sent") {
      await updateApplicationStatus(application.id, "payment_sent");
    }
    redirectWithMessage(
      `/admin/applications/${application.id}`,
      "notice",
      "An active payment link already exists.",
    );
  }

  let order = orders.find((item) => item.status !== "paid" && item.status !== "refunded") || null;

  if (application.status !== "approved" && application.status !== "payment_sent") {
    await updateApplicationStatus(application.id, "approved");
    await recordAdminAuditLog({
      adminEmail: session.email,
      action: "application.approved",
      targetType: "application",
      targetId: application.id,
      metadata: { previousStatus: application.status },
    });
  }

  try {
    if (!order) {
      order = await createOrderForApplication(application);
    }

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
    await recordAdminAuditLog({
      adminEmail: session.email,
      action: "application.payment_link_created",
      targetType: "application",
      targetId: application.id,
      metadata: { orderId: order.id, stripeCheckoutSessionId: checkoutSession.id },
    });
  } catch (error) {
    if (order) {
      await updateOrder(order.id, { status: "payment_failed" }).catch(() => undefined);
    }
    console.error("Unable to create approved application checkout", error);
    redirectWithMessage(
      `/admin/applications/${application.id}`,
      "error",
      "The application was approved, but Stripe could not create a payment link. Please try again.",
    );
  }

  redirectWithMessage(
    `/admin/applications/${application.id}`,
    "notice",
    "Application approved and payment link created.",
  );
}
