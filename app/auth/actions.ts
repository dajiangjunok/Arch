"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSiteUrl } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeAuthNext } from "@/lib/auth-redirect";

async function clearSupabaseAuthCookies() {
  const cookieStore = await cookies();

  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith("sb-") && (cookie.name.includes("auth-token") || cookie.name.includes("code-verifier"))) {
      cookieStore.delete(cookie.name);
    }
  }
}

export async function googleOAuthAction(formData: FormData) {
  const next = safeAuthNext(String(formData.get("next") || ""));
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  await clearSupabaseAuthCookies();

  const redirectTo = `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    const query = new URLSearchParams({
      error: error?.message || "Google sign-in is not available. Check the authentication provider configuration.",
      next,
    });
    redirect(`/login?${query.toString()}`);
  }

  redirect(data.url);
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  await clearSupabaseAuthCookies();
  redirect("/login");
}
