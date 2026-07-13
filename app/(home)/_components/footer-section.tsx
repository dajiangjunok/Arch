import { applyPath } from "../_data/home-data";

export function FooterSection() {
  return (
    <footer className="footer bg-navy px-6 py-24 pb-36 text-ivory sm:px-10 lg:px-20 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ivory/50">Journey&apos;s End</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ivory/50">07 / 07</span>
        </div>

        <div className="flex max-w-[820px] flex-col items-start gap-10">
          <h2 className="font-serif text-[clamp(2.8rem,6.5vw,5rem)] font-semibold leading-none tracking-normal text-ivory">
            Cross the bridge.
            <br />
            Build what&apos;s <span className="text-marigold">next</span>.
          </h2>
          <p className="max-w-xl text-sm leading-8 text-ivory/75">
            For founders, investors, researchers, operators, corporates and builders who need direct access to China&apos;s applied
            innovation ecosystem.
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-ivory/60">Nov.1 - Nov.21, 2026 · Fuxing Island, Shanghai</p>
          <div className="flex flex-wrap items-center gap-6">
            <a className="btn-marigold magnetic reveal" href={applyPath}>
              Apply to Participate
            </a>
            <a href="/account" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ivory underline decoration-marigold decoration-2 underline-offset-4">
              My account
            </a>
          </div>
        </div>

        <div className="mt-24 flex items-end justify-between gap-6 border-t border-ivory/20 pt-8">
          <div>
            <p className="font-serif text-xl font-bold">The Arch.</p>
            <a className="font-mono text-xs tracking-[0.15em] text-ivory/70 transition hover:text-marigold" href="mailto:business@globalpropeller.com">
              business@globalpropeller.com
            </a>
          </div>

          <svg className="hidden h-[60px] w-40 shrink-0 sm:block" viewBox="0 0 160 60" aria-hidden="true">
            <path d="M 16 50 A 64 44 0 0 1 144 50" fill="none" stroke="var(--marigold)" strokeWidth="7" />
            <line x1="4" y1="50" x2="156" y2="50" stroke="var(--marigold)" strokeWidth="5" />
            <g transform="translate(80 46) scale(0.85)" fill="var(--ivory)">
              <circle cx="0" cy="-17" r="3.6" />
              <rect x="-1.5" y="-14" width="3" height="11" rx="1.3" />
              <rect x="-1.5" y="-4" width="2.8" height="10" rx="1.3" transform="rotate(20 0 -4)" />
              <rect x="-1.5" y="-4" width="2.8" height="10" rx="1.3" transform="rotate(-22 0 -4)" />
            </g>
          </svg>
        </div>
      </div>
    </footer>
  );
}
