import "server-only";

import { headers } from "next/headers";

const developmentSiteKey = "1x00000000000000000000AA";
const developmentSecretKey = "1x0000000000000000000000000000000AA";

function getFirstConfiguredEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }

  return null;
}

export function getTurnstileSiteKey() {
  return getFirstConfiguredEnv(
    "TURNSTILE_SITE_KEY",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    "CLOUDFLARE_TURNSTILE_SITE_KEY",
    "NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY",
  ) ||
    (process.env.NODE_ENV !== "production" ? developmentSiteKey : null);
}

export async function verifyTurnstile(formData: FormData, expectedAction: string) {
  const token = String(formData.get("cf-turnstile-response") || "");
  const secretKey = getFirstConfiguredEnv(
    "TURNSTILE_SECRET_KEY",
    "CLOUDFLARE_TURNSTILE_SECRET_KEY",
  ) ||
    (process.env.NODE_ENV !== "production" ? developmentSecretKey : null);

  if (!secretKey) {
    return { ok: false, message: "Security verification is not configured." } as const;
  }

  if (!token) {
    return { ok: false, message: "Complete the security check before continuing." } as const;
  }

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const body = new URLSearchParams({ secret: secretKey, response: token });

  if (forwardedFor) body.set("remoteip", forwardedFor);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
    });
    const result = (await response.json()) as {
      success: boolean;
      action?: string;
      "error-codes"?: string[];
    };

    if (!result.success || (result.action && result.action !== expectedAction)) {
      const expired = result["error-codes"]?.includes("timeout-or-duplicate");
      return {
        ok: false,
        message: expired
          ? "The security check expired. Complete it again."
          : "The security check could not be verified. Try again.",
      } as const;
    }

    return { ok: true } as const;
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return { ok: false, message: "Security verification is temporarily unavailable. Try again." } as const;
  }
}
