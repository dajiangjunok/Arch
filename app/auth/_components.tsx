import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-ivory px-6 py-8 text-ink sm:px-10 sm:py-10 lg:px-20">
      <div className="mx-auto max-w-[1120px]">
        <header className="flex items-center justify-between gap-5">
          <Link href="/" className="font-serif text-4xl font-black leading-none text-navy sm:text-5xl">
            The Arch.
          </Link>
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/65 underline decoration-marigold decoration-2 underline-offset-4">
            Back home
          </Link>
        </header>

        <section className="mt-14 grid overflow-hidden border border-ink bg-card shadow-ink lg:grid-cols-[0.78fr_1fr]">
          <div className="relative min-h-64 overflow-hidden bg-navy p-8 text-ivory sm:p-10 lg:min-h-[620px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-marigold">Member passage</p>
            <div className="mt-16 max-w-md lg:mt-40">
              <p className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-none">
                One account.
                <br />One journey record.
              </p>
              <p className="mt-7 max-w-sm text-sm leading-7 text-ivory/72">
                Applications, secure checkout and payment confirmations stay connected to the email you use here.
              </p>
            </div>
            <div className="absolute bottom-8 left-8 right-8 border-t border-ivory/25 pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ivory/55 sm:left-10 sm:right-10">
              Shanghai / Nov. 1-21, 2026
            </div>
          </div>

          <div className="flex items-center p-7 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              <p className="arch-eyebrow">{eyebrow}</p>
              <h1 className="mt-4 font-serif text-[clamp(2.7rem,5vw,4rem)] font-semibold leading-none text-navy">{title}</h1>
              <span className="title-rule" />
              <p className="mt-6 text-sm leading-7 text-ink/68">{description}</p>
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function AuthMessage({ error, notice }: { error?: string; notice?: string }) {
  if (!error && !notice) return null;

  return (
    <p className={`mb-5 border px-4 py-3 text-sm leading-6 ${error ? "border-red-800/30 bg-red-50 text-red-900" : "border-navy/25 bg-ivory text-navy"}`}>
      {error || notice}
    </p>
  );
}
