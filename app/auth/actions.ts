"use server";

import { redirect } from "next/navigation";
import { getSiteUrl } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";

function safeNext(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : "";
  return path === "/apply" || path === "/account" ? path : "/account";
}

function redirectWithMessage(
  path: string,
  key: "error" | "notice",
  message: string,
  next: string,
  extra?: Record<string, string>,
): never {
  const query = new URLSearchParams({ [key]: message, next, ...extra });
  redirect(`${path}?${query.toString()}`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    redirectWithMessage("/login", "error", "Enter your email and password.", next);
  }

  const verification = await verifyTurnstile(formData, "login");

  if (!verification.ok) {
    redirectWithMessage("/login", "error", verification.message, next);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "over_request_rate_limit") {
      redirectWithMessage("/login", "error", "Too many sign-in attempts. Wait a few minutes before trying again.", next);
    }

    if (error.code === "email_not_confirmed") {
      redirectWithMessage(
        "/login",
        "error",
        "Confirm your email address before signing in. Check your inbox or request a new confirmation email below.",
        next,
        { unconfirmed: "1" },
      );
    }

    redirectWithMessage("/login", "error", "The email or password is incorrect.", next);
  }

  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeNext(formData.get("next"));

  if (!email || password.length < 8) {
    redirectWithMessage("/signup", "error", "Use a valid email and a password with at least 8 characters.", next);
  }

  const verification = await verifyTurnstile(formData, "signup");

  if (!verification.ok) {
    redirectWithMessage("/signup", "error", verification.message, next);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    const message =
      error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit"
        ? "Too many account requests. Wait a few minutes before trying again."
        : error.message;
    redirectWithMessage("/signup", "error", message, next);
  }

  if (data.session) {
    redirect(next);
  }

  redirectWithMessage(
    "/login",
    "notice",
    "Account created. Check your inbox to confirm your email, then sign in.",
    next,
    { unconfirmed: "1" },
  );
}

export async function resendConfirmationAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const next = safeNext(formData.get("next"));

  if (!email) {
    redirectWithMessage(
      "/login",
      "error",
      "Enter the email address you used to create the account.",
      next,
      { unconfirmed: "1" },
    );
  }

  const verification = await verifyTurnstile(formData, "resend_confirmation");

  if (!verification.ok) {
    redirectWithMessage("/login", "error", verification.message, next, { unconfirmed: "1" });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    const message =
      error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit"
        ? "A confirmation email was sent recently. Wait a minute before trying again."
        : "We could not resend the confirmation email. Check the address and try again.";
    redirectWithMessage("/login", "error", message, next, { unconfirmed: "1" });
  }

  redirectWithMessage("/login", "notice", "A new confirmation email has been sent. Check your inbox and spam folder.", next);
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
