import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthField, AuthMessage, AuthShell } from "../auth/_components";
import { loginAction, resendConfirmationAction } from "../auth/actions";
import { TurnstileField } from "../auth/turnstile-field";
import { getTurnstileSiteKey } from "@/lib/turnstile";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string; unconfirmed?: string }>;
}) {
  const params = await searchParams;
  const next = params.next === "/apply" || params.next === "/account" ? params.next : "/account";
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
        <button className="mt-2 min-h-12 rounded-md bg-navy px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-marigold hover:text-ink focus:outline-none focus:ring-4 focus:ring-marigold/35">
          Sign in
        </button>
      </form>
      {params.unconfirmed === "1" ? (
        <form action={resendConfirmationAction} className="mt-6 grid gap-3 border-t border-ink/20 pt-6">
          <input type="hidden" name="next" value={next} />
          <AuthField label="Email to confirm" name="email" type="email" autoComplete="email" />
          <TurnstileField siteKey={turnstileSiteKey} action="resend_confirmation" />
          <button className="min-h-11 rounded-md border border-navy px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-navy transition hover:bg-navy hover:text-ivory focus:outline-none focus:ring-4 focus:ring-marigold/30">
            Resend confirmation email
          </button>
        </form>
      ) : null}
      <p className="mt-6 text-sm text-ink/70">
        New to The Arch.?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-navy underline decoration-marigold decoration-2 underline-offset-4">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
