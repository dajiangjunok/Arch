import { collection } from "../_data/home-data";
import { SectionHeading } from "./section-heading";

function FrameArt({ variant }: { variant: string }) {
  if (variant === "circle") {
    return (
      <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="200" height="240" fill="var(--ivory)" />
        <rect width="110" height="240" fill="var(--marigold)" />
        <rect x="110" width="90" height="240" fill="var(--navy)" />
        <circle cx="110" cy="120" r="46" fill="var(--ivory)" />
        <circle cx="110" cy="120" r="20" fill="var(--navy)" />
      </svg>
    );
  }

  if (variant === "arch") {
    return (
      <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="200" height="240" fill="var(--navy)" />
        <path d="M 20 200 A 80 80 0 0 1 180 200" fill="none" stroke="var(--marigold)" strokeWidth="16" />
        <rect y="200" width="200" height="40" fill="var(--marigold)" />
        <circle cx="100" cy="70" r="30" fill="var(--ivory)" />
      </svg>
    );
  }

  if (variant === "blocks") {
    return (
      <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="200" height="240" fill="var(--ivory)" />
        <rect y="40" width="200" height="90" fill="var(--marigold)" transform="rotate(-3 100 85)" />
        <rect x="30" y="130" width="140" height="80" fill="var(--navy)" transform="rotate(2 100 170)" />
        <circle cx="150" cy="50" r="26" fill="var(--navy)" />
      </svg>
    );
  }

  if (variant === "tower") {
    return (
      <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="200" height="240" fill="var(--marigold)" />
        <rect x="40" width="120" height="240" fill="var(--navy)" />
        <rect x="70" y="40" width="60" height="60" fill="var(--marigold)" />
        <rect x="70" y="120" width="60" height="14" fill="var(--ivory)" />
        <rect x="70" y="150" width="60" height="14" fill="var(--ivory)" />
        <circle cx="100" cy="200" r="16" fill="var(--ivory)" />
      </svg>
    );
  }

  if (variant === "lens") {
    return (
      <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="200" height="240" fill="var(--ivory)" />
        <circle cx="100" cy="86" r="52" fill="var(--navy)" />
        <circle cx="100" cy="86" r="24" fill="var(--marigold)" />
        <rect x="30" y="168" width="140" height="14" fill="var(--ink)" transform="rotate(-1.5 100 175)" />
        <rect x="52" y="196" width="96" height="10" fill="var(--marigold)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="240" fill="var(--ivory)" />
      <rect width="200" height="150" fill="var(--navy)" />
      <circle cx="60" cy="60" r="40" fill="var(--marigold)" />
      <rect x="120" y="150" width="80" height="90" fill="var(--marigold)" transform="rotate(-2 160 195)" />
      <rect x="24" y="176" width="70" height="10" fill="var(--navy)" />
    </svg>
  );
}

export function CollectionSection() {
  return (
    <section id="collection" className="arch-section overflow-hidden">
      <div className="arch-wrap">
        <SectionHeading eyebrow="Company Visits" title="The Collection" exhibit="03 / 07" />
      </div>

      <div className="gallery-scroller mt-4 overflow-x-auto overscroll-x-contain pb-8" id="galleryScroller">
        <div className="relative flex w-max items-start gap-12 px-[8vw] pb-2 pt-6 lg:gap-24">
          <div className="pointer-events-none absolute left-0 right-0 top-[296px] z-0 h-px bg-ink/25" aria-hidden="true" />
          {collection.map((item, index) => (
            <article
              key={item.company}
              className={`frame-item reveal relative z-10 flex w-[clamp(220px,18vw,260px)] shrink-0 flex-col items-center ${
                index % 3 === 0 ? "-rotate-1" : index % 3 === 1 ? "rotate-1" : "-rotate-[0.6deg]"
              }`}
            >
              <div className="frame tilt shadow-ink w-full border-4 border-ink bg-ivory p-3 transition hover:shadow-[10px_12px_0_0_var(--ink)]">
                <div className="aspect-[5/6] overflow-hidden border border-ink/40">
                  <FrameArt variant={item.art} />
                </div>
              </div>
              <div className="mt-6 w-full max-w-[210px] text-center">
                <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em]">{item.company}</p>
                <p className="mt-1 font-serif text-base italic text-navy">{item.subject}</p>
                <div className="mx-auto mt-3 h-px w-10 bg-ink/30" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">{item.meta}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Medium: Company Visit</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-ink/45" aria-hidden="true">
        ← Drag to walk the gallery →
      </p>
      <div className="arch-wrap">
        <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
          + Fourier Intelligence · TMiRob · Kepler Robotics · Looki ai · Odyss Life · wakuart - full collection revealed on arrival
        </p>
      </div>
    </section>
  );
}
