"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createStripeCheckoutSession, createStripeRefund } from "@/lib/stripe";
import { parseMoneyInput } from "@/lib/money";
import {
  attachStripeRefundToRequest,
  beginRefundRequest,
  createOrderForApplication,
  createDistributor,
  createReferralCode,
  getAdminUserOption,
  getApplication,
  getOrdersForApplication,
  getRefundRequest,
  listDistributors,
  recordAdminAuditLog,
  rejectRefundRequest,
  resetRefundRequestAfterStripeError,
  updateCommissionStatus,
  updateApplicationStatus,
  updateDistributorStatus,
  updateOrder,
} from "@/lib/store";
import type { ApplicationStatus, CommissionStatus, DistributorStatus } from "@/lib/types";

const reviewStatuses: ApplicationStatus[] = [
  "pending_review",
  "rejected",
  "more_info_required",
  "canceled",
];

const reviewEditableStatuses: ApplicationStatus[] = [
  ...reviewStatuses,
  "interview_invited",
];

const interviewInvitableStatuses: ApplicationStatus[] = [
  "pending_review",
  "more_info_required",
];

const approvableStatuses: ApplicationStatus[] = [
  "interview_invited",
  "approved",
  "payment_sent",
];

function redirectWithMessage(path: string, key: "notice" | "error", message: string): never {
  redirect(`${path}?${key}=${encodeURIComponent(message)}`);
}

function inviteCodeForEmail(email: string) {
  const prefix = email
    .split("@")[0]
    .replace(/[^a-z0-9]+/gi, "")
    .slice(0, 10)
    .toUpperCase() || "USER";
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();

  return `ARCH-${prefix}-${suffix}`;
}

export async function createDistributorAction(formData: FormData) {
  const session = await requireAdmin();
  const userId = String(formData.get("userId") || "").trim();
  const commissionRate = Number(formData.get("commissionRate") || 0);

  if (!userId || !Number.isFinite(commissionRate) || commissionRate < 0 || commissionRate > 100) {
    redirectWithMessage("/admin/referrals", "error", "Select a user and enter a commission rate from 0 to 100.");
  }

  const user = await getAdminUserOption(userId);
  if (!user?.email) {
    redirectWithMessage("/admin/referrals", "error", "The selected user could not be found.");
  }

  const existingDistributor = (await listDistributors()).find(
    (distributor) => distributor.userId === user.id || distributor.email?.toLowerCase() === user.email,
  );

  if (existingDistributor) {
    redirectWithMessage("/admin/referrals", "error", "This user is already a distributor.");
  }

  let createdCode = "";

  try {
    const distributor = await createDistributor({
      userId: user.id,
      name: user.displayName,
      email: user.email,
      commissionRate,
    });
    const referralCode = await createReferralCode({
      code: inviteCodeForEmail(user.email),
      distributorId: distributor.id,
    });

    await recordAdminAuditLog({
      adminUserId: session.userId,
      adminEmail: session.email,
      action: "distributor.created",
      targetType: "distributor",
      targetId: distributor.id,
      metadata: { userId: user.id, email: user.email, commissionRate, referralCode: referralCode.code },
    });
    createdCode = referralCode.code;
  } catch (error) {
    console.error("Unable to create distributor", error);
    redirectWithMessage("/admin/referrals", "error", "The distributor could not be created.");
  }

  redirectWithMessage("/admin/referrals", "notice", `Distributor created. Invite code: ${createdCode}`);
}

export async function updateDistributorStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const distributorId = String(formData.get("distributorId") || "").trim();
  const status = String(formData.get("status") || "") as DistributorStatus;

  if (!distributorId || !["active", "inactive"].includes(status)) {
    redirectWithMessage("/admin/referrals", "error", "Invalid distributor update.");
  }

  await updateDistributorStatus(distributorId, status);
  await recordAdminAuditLog({
    adminUserId: session.userId,
    adminEmail: session.email,
    action: "distributor.status_updated",
    targetType: "distributor",
    targetId: distributorId,
    metadata: { status },
  });
  redirectWithMessage("/admin/referrals", "notice", "Distributor status updated.");
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
    adminUserId: session.userId,
    adminEmail: session.email,
    action: "commission.status_updated",
    targetType: "commission",
    targetId: commissionId,
    metadata: { status },
  });
  redirectWithMessage("/admin/referrals", "notice", "Commission status updated.");
}

export async function updateApplicationStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const applicationId = String(formData.get("applicationId") || "");
  const status = String(formData.get("status") || "") as ApplicationStatus;

  if (!applicationId || !reviewStatuses.includes(status)) {
    redirectWithMessage("/admin/applications", "error", "Invalid status update.");
  }

  const application = await getApplication(applicationId);

  if (!application || !reviewEditableStatuses.includes(application.status)) {
    redirectWithMessage(
      application ? `/admin/applications/${applicationId}` : "/admin/applications",
      "error",
      "The review status can no longer be changed for this application.",
    );
  }

  await updateApplicationStatus(applicationId, status);
  await recordAdminAuditLog({
    adminUserId: session.userId,
    adminEmail: session.email,
    action: "application.status_updated",
    targetType: "application",
    targetId: applicationId,
    metadata: { previousStatus: application.status, status },
  });

  redirectWithMessage(`/admin/applications/${applicationId}`, "notice", "Application status updated.");
}

export async function inviteToInterviewAction(formData: FormData) {
  const session = await requireAdmin();
  const applicationId = String(formData.get("applicationId") || "");
  const application = applicationId ? await getApplication(applicationId) : null;

  if (!application || !interviewInvitableStatuses.includes(application.status)) {
    redirectWithMessage(
      applicationId ? `/admin/applications/${applicationId}` : "/admin/applications",
      "error",
      "This application cannot be invited to an interview.",
    );
  }

  await updateApplicationStatus(application.id, "interview_invited");
  await recordAdminAuditLog({
    adminUserId: session.userId,
    adminEmail: session.email,
    action: "application.interview_invited",
    targetType: "application",
    targetId: application.id,
    metadata: { previousStatus: application.status },
  });

  redirectWithMessage(
    `/admin/applications/${application.id}`,
    "notice",
    "Applicant invited to schedule an interview.",
  );
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
  const paidOrder = orders.find((order) =>
    ["paid", "partially_refunded", "refunded"].includes(order.status),
  );

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

  let order = orders.find((item) =>
    !["paid", "partially_refunded", "refunded"].includes(item.status),
  ) || null;

  if (application.status !== "approved" && application.status !== "payment_sent") {
    await updateApplicationStatus(application.id, "approved");
    await recordAdminAuditLog({
      adminUserId: session.userId,
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
      adminUserId: session.userId,
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

export async function approveRefundAction(formData: FormData) {
  const session = await requireAdmin();
  const refundRequestId = String(formData.get("refundRequestId") || "");
  const request = refundRequestId ? await getRefundRequest(refundRequestId) : null;

  if (!request || request.status !== "pending") {
    redirectWithMessage("/admin/refunds", "error", "This refund request is no longer pending.");
  }

  const approvedAmount = parseMoneyInput(
    String(formData.get("approvedAmount") || ""),
    request.currency,
  );
  const adminNote = String(formData.get("adminNote") || "").trim();

  if (!approvedAmount) {
    redirectWithMessage("/admin/refunds", "error", "Enter a valid refund amount.");
  }

  let started = false;
  let auditMetadata: Record<string, unknown> | null = null;

  try {
    const prepared = await beginRefundRequest({
      refundRequestId: request.id,
      adminEmail: session.email,
      approvedAmount,
      adminNote: adminNote || null,
    });
    started = true;

    const refund = await createStripeRefund({
      paymentIntentId: prepared.paymentIntentId,
      amount: prepared.approvedAmount,
      orderId: prepared.orderId,
      refundRequestId: prepared.refundRequestId,
    });

    await attachStripeRefundToRequest({
      refundRequestId: prepared.refundRequestId,
      stripeRefundId: refund.id,
      stripeStatus: refund.status,
    });

    auditMetadata = {
      orderId: prepared.orderId,
      approvedAmount: prepared.approvedAmount,
      currency: prepared.currency,
      stripeRefundId: refund.id,
    };
  } catch (error) {
    console.error("Unable to create Stripe refund", error);
    if (started) {
      await resetRefundRequestAfterStripeError(
        request.id,
        error instanceof Error ? error.message : "Stripe refund request failed.",
      ).catch(() => undefined);
    }
    redirectWithMessage(
      "/admin/refunds",
      "error",
      "Stripe could not start the refund. The request remains available for a safe retry.",
    );
  }

  if (auditMetadata) {
    await recordAdminAuditLog({
      adminUserId: session.userId,
      adminEmail: session.email,
      action: "refund.approved",
      targetType: "refund_request",
      targetId: request.id,
      metadata: auditMetadata,
    }).catch((error) => console.error("Unable to record refund audit log", error));
  }

  redirectWithMessage(
    "/admin/refunds",
    "notice",
    "Refund submitted to Stripe. Final status will be confirmed by webhook.",
  );
}

export async function rejectRefundAction(formData: FormData) {
  const session = await requireAdmin();
  const refundRequestId = String(formData.get("refundRequestId") || "");
  const adminNote = String(formData.get("adminNote") || "").trim();

  if (!refundRequestId || adminNote.length < 3 || adminNote.length > 1000) {
    redirectWithMessage("/admin/refunds", "error", "Provide a reason for declining this request.");
  }

  const request = await rejectRefundRequest({
    refundRequestId,
      adminEmail: session.email,
    adminNote,
  });

  if (!request) {
    redirectWithMessage("/admin/refunds", "error", "This refund request is no longer pending.");
  }

  await recordAdminAuditLog({
    adminUserId: session.userId,
    adminEmail: session.email,
    action: "refund.rejected",
    targetType: "refund_request",
    targetId: request.id,
    metadata: { orderId: request.orderId, requestedAmount: request.requestedAmount },
  });

  redirectWithMessage("/admin/refunds", "notice", "Refund request declined.");
}
