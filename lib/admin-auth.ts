import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { createSupabaseAdminClient } from "./supabase/admin";
import type { UserRole } from "./types";

export type AdminSession = {
  userId: string;
  email: string;
  role: "admin";
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const user = await getCurrentUser();
  if (!user?.email) return null;

  const { data, error } = await createSupabaseAdminClient()
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin" satisfies UserRole)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return { userId: user.id, email: user.email, role: "admin" };
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  return session;
}
