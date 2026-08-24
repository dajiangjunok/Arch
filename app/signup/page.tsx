import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthMessage, AuthShell } from "../auth/_components";
import { googleOAuthAction } from "../auth/actions";
import { SubmitButton } from "../auth/submit-button";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next === "/" || params.next === "/apply" || params.next === "/account" || params.next === "/partner" ? params.next : "/";
  const user = await getCurrentUser();

  if (user) redirect(next);

  return (
    <AuthShell eyebrow="New member" title="Create account" description="Use Google to create your account and keep applications, orders and payment confirmations in one place.">
      <AuthMessage error={params.error} />
      <form action={googleOAuthAction} className="grid gap-4">
        <input type="hidden" name="next" value={next} />
        <SubmitButton
          pendingLabel="Opening Google..."
          className="min-h-12 w-full rounded-md border border-ink/20 bg-ivory px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-navy hover:bg-navy hover:text-ivory focus:outline-none focus:ring-4 focus:ring-marigold/35"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-white font-sans text-sm font-bold normal-case tracking-normal text-[#4285f4] shadow-sm">
            G
          </span>
          <span className="whitespace-nowrap">Continue with Google</span>
        </SubmitButton>
      </form>
      <p className="mt-6 text-sm leading-7 text-ink/70">If this Google account has already been used, you will be signed in instead.</p>
    </AuthShell>
  );
}
