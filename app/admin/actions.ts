"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  requireAdmin,
  setAdminSession,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { recordAdminAuditLog, updateApplicationStatus } from "@/lib/store";
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
