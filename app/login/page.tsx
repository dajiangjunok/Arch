import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthField, AuthMessage, AuthShell } from "../auth/_components";
import { loginAction } from "../auth/actions";
import { SubmitButton } from "../auth/submit-button";
import { TurnstileField } from "../auth/turnstile-field";
import { getTurnstileSiteKey } from "@/lib/turnstile";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next === "/apply" || params.next === "/account" || params.next === "/partner" ? params.next : "/account";
  const user = await getCurrentUser();
  const turnstileSiteKey = getTurnstileSiteKey();

  if (user) redirect(next);

  return (
    <AuthShell eyebrow="Account access" title="Sign in" description="Use the same email for your application and Stripe receipt.">
      <AuthMessage error={params.error} notice={params.notice} />
      <form action={loginAction} className="grid gap-4">
        <input type="hidden" name="next" value={next} />
        <AuthField label="Email" name="email" type="email" autoComplete="email" />
        <AuthField label="Password" name="password" type="password" autoComplete="current-password" />
        <TurnstileField siteKey={turnstileSiteKey} action="login" />
        <SubmitButton
          pendingLabel="Signing in..."
          className="mt-2 min-h-12 rounded-md bg-navy px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-marigold hover:text-ink focus:outline-none focus:ring-4 focus:ring-marigold/35"
        >
          Sign in
        </SubmitButton>
      </form>
      <p className="mt-6 text-sm text-ink/70">
        New to The Arch.?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-navy underline decoration-marigold decoration-2 underline-offset-4">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
