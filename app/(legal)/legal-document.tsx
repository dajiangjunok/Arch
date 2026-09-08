import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLockup } from "@/app/_components/brand-lockup";
import { LegalLinks } from "@/app/_components/legal-links";

export const legalContactEmail = "thearch@globalpropeller.com";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

export function LegalContact() {
  return <a href={`mailto:${legalContactEmail}`} className="break-words">{legalContactEmail}</a>;
}

export function LegalDocument({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: readonly LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-ivory px-6 py-8 text-ink sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1120px]">
        <a href="#legal-content" className="sr-only focus:not-sr-only focus:mb-6 focus:block focus:underline">
          Skip to document
        </a>
        <header className="flex flex-wrap items-center justify-between gap-6 border-b border-ink/20 pb-8">
          <BrandLockup priority />
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.16em] underline decoration-marigold decoration-2 underline-offset-4">
            Back home ↗
          </Link>
        </header>

        <main id="legal-content" tabIndex={-1}>
          <div className="py-12 sm:py-16">
            <p className="arch-eyebrow">The Arch. / Legal</p>
            <h1 className="mt-5 font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[1.05] tracking-tight text-navy">
              {title}
            </h1>
            <span className="title-rule" />
            <p className="mt-6 max-w-2xl font-sans text-lg leading-8 text-ink/75">{description}</p>
            <p className="mt-6 font-mono text-[11px] uppercase leading-6 tracking-[0.12em] text-ink-soft">
              Last updated / <time dateTime="2026-09-07">September 7, 2026</time>
            </p>
          </div>

          <div className="grid items-start gap-10 border-t border-ink/20 py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 lg:py-12">
            <aside className="lg:sticky lg:top-8">
              <nav aria-label={`${title} contents`}>
                <p className="arch-eyebrow">On this page</p>
                <ol className="mt-5 grid gap-3 text-sm leading-6">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="group flex gap-3 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                        <span className="font-mono text-[11px] text-ink-soft" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                        <span className="group-hover:underline group-hover:underline-offset-4">{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="mt-8 border-t border-ink/20 pt-6">
                <LegalLinks className="flex-col !items-start" />
              </div>
            </aside>

            <article aria-label={title} className="min-w-0 border border-ink/20 bg-card px-6 py-8 sm:px-10 sm:py-10">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-8 border-t border-ink/15 py-8 first:border-0 first:pt-0 last:pb-0">
                  <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-ink-soft" aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
                  <h2 id={`${section.id}-title`} className="font-serif text-2xl font-semibold leading-tight text-navy sm:text-3xl">{section.title}</h2>
                  <div className="mt-5 space-y-4 font-sans text-base leading-7 text-ink/80 [&_a]:underline [&_a]:decoration-navy/40 [&_a]:underline-offset-4 [&_a:hover]:text-navy [&_li]:pl-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-5">
                    {section.content}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </main>

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-6 border-t border-ink/20 py-8">
          <p className="font-serif text-base italic text-navy">A bridge is worth what crosses it.</p>
          <LegalLinks />
        </footer>
      </div>
    </div>
  );
}
