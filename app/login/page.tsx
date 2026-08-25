import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { safeAuthNext } from "@/lib/auth-redirect";
import { AuthMessage, AuthShell } from "../auth/_components";
import { googleOAuthAction } from "../auth/actions";
import { SubmitButton } from "../auth/submit-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = safeAuthNext(params.next);
  const user = await getCurrentUser();

  if (user) redirect(next);

  return (
    <AuthShell eyebrow="Account access" title="Sign in" description="Use Google to access your application, orders and payment confirmations.">
      <AuthMessage error={params.error} notice={params.notice} />
      <form action={googleOAuthAction} className="grid gap-4">
        <input type="hidden" name="next" value={next} />
        <SubmitButton
          pendingLabel="Opening Google..."
          className="min-h-12 w-full rounded-md border border-ink/20 bg-ivory px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-navy hover:bg-navy hover:text-ivory focus:outline-none focus:ring-4 focus:ring-marigold/35"
        >
          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white font-sans text-sm font-bold normal-case tracking-normal text-[#4285f4] shadow-sm">
              G
            </span>
            <span>Continue with Google</span>
          </span>
        </SubmitButton>
      </form>
      <p className="mt-6 text-sm leading-7 text-ink/70">A new account is created automatically the first time you continue with Google.</p>
    </AuthShell>
  );
}
