import Link from "next/link";
import { ApplicationForm } from "@/app/(home)/_components/application-form";
import { requireUser } from "@/lib/auth";

export default async function ApplyPage() {
  const user = await requireUser("/apply");

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

        <section className="mt-14 grid gap-10 lg:grid-cols-[0.74fr_1fr] lg:items-start">
          <div className="lg:sticky lg:top-10">
            <p className="arch-eyebrow">Participation Form</p>
            <h1 className="mt-4 font-serif text-[clamp(2.8rem,7vw,5.2rem)] font-semibold leading-none tracking-normal text-navy">
              Apply to Participate
            </h1>
            <span className="title-rule" />
            <p className="mt-8 max-w-xl text-sm leading-8 text-ink/72">
              Tell us who you are, choose the pass that fits your schedule, then continue directly to secure Stripe Checkout.
              Your application and payment will stay linked to your account.
            </p>

            <div className="torn-soft shadow-ink mt-10 bg-marigold p-7 text-ink">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em]">Nov.1 - Nov.21, 2026</p>
              <p className="mt-4 font-serif text-3xl font-semibold leading-tight">Fuxing Island · Shanghai</p>
              <div className="mt-6 h-px bg-ink/30" />
              <p className="mt-5 text-sm leading-7">
                Three weeks of closed-door labs, founder access, investor matchmaking and applied innovation fieldwork.
              </p>
            </div>
          </div>

          <div className="shadow-ink border border-ink bg-card p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-ink">The Arch. admission desk</p>
            <div className="mt-7">
              <ApplicationForm email={user.email || ""} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
