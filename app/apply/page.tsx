import Link from "next/link";
import { redirect } from "next/navigation";
import { ApplicationForm } from "@/app/(home)/_components/application-form";
import { getCurrentUser } from "@/lib/auth";
import { ticketOptions } from "@/lib/tickets";
import type { ProgramWeek, TicketId } from "@/lib/types";
import { getUserIdentity } from "@/lib/user-identity";
import { cookies } from "next/headers";

const applicationSteps = [
  {
    title: "Submit your application",
    body: "Fill out the form with your basic information and the week you're interested in.",
  },
  {
    title: "Have a 30-minute conversation",
    body: "Our team will review your application and invite you to a short conversation to learn more about your interests, goals, and what you hope to get from the program.",
  },
  {
    title: "Receive your offer",
    body: "If approved, you'll receive a formal offer with payment instructions and a deadline to confirm your seat.",
  },
  {
    title: "Join the cohort",
    body: "Once your seat is confirmed, we'll share everything you need to prepare, including accommodation, itinerary, and pre-arrival details.",
  },
];

const validWeeks: ProgramWeek[] = ["week_1", "week_2", "week_3"];

export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ pass?: string; week?: string }> }) {
  const { pass, week } = await searchParams;
  const applyPath = `/apply?${new URLSearchParams({
    ...(pass ? { pass } : {}),
    ...(week ? { week } : {}),
  }).toString()}`;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(applyPath)}`);
  }

  const identity = getUserIdentity(user);
  const defaultTicket = ticketOptions.some((ticket) => ticket.id === pass)
    ? (pass as TicketId)
    : "single_week";
  const defaultWeek = validWeeks.includes(week as ProgramWeek) ? (week as ProgramWeek) : "week_1";
  const referralCode = (await cookies()).get("arch_referral_code")?.value || "";

  return (
    <main className="min-h-screen bg-ivory px-6 py-10 text-ink sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1120px]">
        <header className="flex items-start justify-between gap-6">
          <Link href="/" className="font-serif text-[clamp(2.6rem,6vw,4.6rem)] font-black leading-none text-navy">
            The Arch.
          </Link>
          <div className="flex flex-wrap justify-end gap-3">
            <Link href="/account" className="rounded-md border border-navy bg-navy px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory transition hover:bg-marigold hover:text-ink">
              My account
            </Link>
            <Link href="/" className="rounded-md border border-ink/25 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition hover:border-ink hover:bg-card">
              Back home
            </Link>
          </div>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.76fr_minmax(0,1.08fr)] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <p className="arch-eyebrow">Application process</p>
            <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-ink">
              Every seat is reviewed individually. Here&apos;s what the application process looks like:
            </p>

            <ol className="mt-5 grid gap-3">
              {applicationSteps.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[2.25rem_1fr] gap-3 border-t border-ink/20 pt-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-navy font-mono text-[10px] font-semibold text-ivory">
                    {index + 1}
                  </span>
                  <span>
                    <strong className="block font-serif text-xl font-semibold leading-tight text-navy">{step.title}</strong>
                    <span className="mt-1.5 block text-sm leading-6 text-ink/70">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-5 border border-ink/20 bg-card p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft">Have a question?</p>
              <p className="mt-2 text-sm leading-6 text-ink/72">
                We&apos;re happy to help. Reach us at{" "}
                <a className="font-semibold text-navy underline decoration-marigold decoration-2 underline-offset-4" href="mailto:thearch@globalpropeller.com">
                  thearch@globalpropeller.com
                </a>
              </p>
            </div>
          </div>

          <div className="w-full max-w-[720px] border border-ink bg-card p-5 shadow-ink sm:p-7 lg:justify-self-end">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-ink">Application form</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Choose Single Week or Fellowship below. Single Week applicants can select Week 1, 2, or 3.
            </p>
            <div className="mt-5">
              {identity.email ? (
                <ApplicationForm email={identity.email} defaultTicket={defaultTicket} defaultWeek={defaultWeek} referralCode={referralCode} />
              ) : (
                <p className="border border-red-800/30 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900">
                  Google did not provide an email for this account. Sign out and use a Google account with an email address before applying.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
