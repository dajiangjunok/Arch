import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthField, AuthMessage, AuthShell } from "../auth/_components";
import { signUpAction } from "../auth/actions";
import { SubmitButton } from "../auth/submit-button";
import { TurnstileField } from "../auth/turnstile-field";
import { getTurnstileSiteKey } from "@/lib/turnstile";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next === "/apply" || params.next === "/account" || params.next === "/partner" ? params.next : "/account";
  const user = await getCurrentUser();
  const turnstileSiteKey = getTurnstileSiteKey();

  if (user) redirect(next);

  return (
    <AuthShell eyebrow="New member" title="Create account" description="Your account keeps applications, orders and payment confirmations in one place.">
      <AuthMessage error={params.error} />
      <form action={signUpAction} className="grid gap-4">
        <input type="hidden" name="next" value={next} />
        <AuthField label="Email" name="email" type="email" autoComplete="email" />
        <AuthField label="Password" name="password" type="password" autoComplete="new-password" />
        <TurnstileField siteKey={turnstileSiteKey} action="signup" />
        <p className="text-xs leading-5 text-ink-soft">Use at least 8 characters. You may need to confirm your email before signing in.</p>
        <SubmitButton
          pendingLabel="Creating account..."
          className="min-h-12 rounded-md bg-marigold px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-navy transition hover:bg-navy hover:text-ivory focus:outline-none focus:ring-4 focus:ring-navy/20"
        >
          Create account
        </SubmitButton>
      </form>
      <p className="mt-6 text-sm text-ink/70">
        Already registered?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-navy underline decoration-marigold decoration-2 underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
