import { BrandLockup } from "../../_components/brand-lockup";
import { applyPath, mailto, pillars } from "../_data/home-data";

function HeroIllustration() {
  const flights = [
    "M 96 150 Q 264.4 328.1 508 356",
    "M 180 96 Q 291.8 291.8 508 356",
    "M 288 74 Q 331.8 266.7 508 356",
    "M 60 300 Q 273.6 411.3 508 356",
    "M 150 452 Q 350.8 485.1 508 356",
    "M 372 508 Q 479.5 467.3 508 356",
    "M 690 470 Q 628.6 365.7 508 356",
    "M 760 214 Q 597.1 219.5 508 356",
  ];

  const cities = [
    ["LON", 96, 150, "middle", 96, 138],
    ["PAR", 180, 96, "middle", 180, 84],
    ["AMS", 288, 74, "middle", 288, 62],
    ["SFO", 60, 300, "end", 50, 303],
    ["DXB", 150, 452, "end", 140, 455],
    ["SIN", 372, 508, "middle", 372, 530],
    ["SYD", 690, 470, "middle", 690, 494],
    ["TOK", 760, 214, "start", 774, 217],
  ] as const;

  return (
    <div className="pointer-events-none absolute right-0 top-28 z-0 w-full max-w-[860px] rotate-1 lg:-right-10 lg:top-22 lg:w-[64%]">
      <svg
        viewBox="0 0 940 720"
        role="img"
        aria-label="Travel-poster collage with a marigold arched bridge, a giant sun and dotted flight paths converging on Shanghai."
      >
        <defs>
          <filter id="paperGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
            <feComponentTransfer in="mono" result="alpha">
              <feFuncA type="linear" slope="0.08" />
            </feComponentTransfer>
            <feComposite operator="in" in="alpha" in2="SourceGraphic" result="grain" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="grain" />
            </feMerge>
          </filter>
          <clipPath id="sunCrop">
            <rect x="0" y="0" width="940" height="720" />
          </clipPath>
        </defs>

        <g className="px-sun" clipPath="url(#sunCrop)">
          <g filter="url(#paperGrain)">
            <circle cx="815" cy="150" r="360" fill="var(--marigold)" />
          </g>
          <circle cx="815" cy="150" r="360" fill="none" stroke="var(--ivory)" strokeWidth="2" opacity="0.18" />
        </g>

        <g fill="none" stroke="var(--navy)" strokeWidth="1.2" strokeDasharray="1 7" strokeLinecap="round" opacity="0.8">
          {flights.map((path) => (
            <path className="flight" d={path} key={path} />
          ))}
        </g>

        <g fontFamily="IBM Plex Mono, monospace" fontSize="10.5" letterSpacing="1.5" fill="var(--ink)">
          {cities.map(([city, cx, cy, anchor, tx, ty]) => (
            <g key={city}>
              <circle cx={cx} cy={cy} r="3.4" fill="var(--navy)" />
              <circle cx={cx} cy={cy} r="8" fill="none" stroke="var(--navy)" strokeWidth="1" opacity="0.45" />
              <text x={tx} y={ty} textAnchor={anchor}>
                {city}
              </text>
            </g>
          ))}
        </g>

        <g className="px-bridge" transform="rotate(-1 470 470)">
          <path d="M 120 560 A 370 384 0 0 1 860 560" fill="none" stroke="var(--ivory)" strokeWidth="46" />
          <g filter="url(#paperGrain)">
            <path d="M 120 560 A 370 384 0 0 1 860 560" fill="none" stroke="var(--marigold)" strokeWidth="34" />
          </g>
          <path d="M 120 560 A 370 384 0 0 1 860 560" fill="none" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
          <g stroke="var(--ink)" strokeWidth="1.4" opacity="0.55">
            {[180, 268, 356, 444, 532, 620, 708, 796].map((x, index) => (
              <line key={x} x1={x} y1={[350.3, 252.8, 202.1, 179, 178.5, 200.5, 249.7, 344.1][index]} x2={x} y2="560" />
            ))}
          </g>
          <g filter="url(#paperGrain)">
            <path d="M 40 560 L 130 559 L 300 561 L 520 559 L 740 561 L 900 559 L 900 588 L 40 588 Z" fill="var(--navy)" />
          </g>
          <rect x="40" y="558" width="860" height="3" fill="var(--ink)" opacity="0.4" />
          <rect x="118" y="560" width="16" height="120" fill="var(--navy)" filter="url(#paperGrain)" />
          <rect x="846" y="560" width="16" height="120" fill="var(--navy)" filter="url(#paperGrain)" />
          <g transform="translate(470 552) scale(1.15)" fill="var(--ink)">
            <circle cx="0" cy="-17" r="3.6" />
            <rect x="-1.5" y="-14" width="3" height="11" rx="1.3" />
            <rect x="-1.5" y="-4" width="2.8" height="10" rx="1.3" transform="rotate(20 0 -4)" />
            <rect x="-1.5" y="-4" width="2.8" height="10" rx="1.3" transform="rotate(-22 0 -4)" />
            <rect x="-1.3" y="-13" width="2.4" height="8" rx="1.1" transform="rotate(32 0 -13)" />
            <rect x="-1.3" y="-13" width="2.4" height="8" rx="1.1" transform="rotate(-14 0 -13)" />
          </g>
        </g>

        <g>
          <circle cx="508" cy="356" r="13" fill="var(--navy)" />
          <circle cx="508" cy="356" r="5.5" fill="var(--marigold)" />
          <text x="530" y="344" fontFamily="IBM Plex Mono, monospace" fontSize="15" fontWeight="600" letterSpacing="3" fill="var(--navy)">
            SHA
          </text>
          <text x="530" y="360" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="2" fill="var(--ink)" opacity="0.7">
            SHANGHAI
          </text>
        </g>
      </svg>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="top" className="hero relative mx-auto min-h-[100svh] max-w-[1440px] overflow-hidden px-6 pb-28 pt-10 sm:px-10 lg:px-20">
      <header className="relative z-20 flex items-start justify-between pt-12 sm:pt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-ink/60">Fuxing Island · Shanghai</p>
        <nav aria-label="Program pillars" className="hidden sm:block">
          <ul className="grid min-w-56 justify-items-stretch gap-0.5">
            {pillars.map((pillar, index) => (
              <li key={pillar.label}>
                <a
                  href={pillar.href}
                  className="group relative flex min-h-8 items-center justify-end gap-3 overflow-hidden px-2 font-mono text-[11px] uppercase tracking-[0.3em] text-navy transition-transform duration-200 ease-out hover:-translate-x-1 focus-visible:-translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold focus-visible:ring-offset-2 motion-reduce:transform-none"
                >
                  <span className="relative text-ink/40 transition-colors group-hover:text-navy/60 group-focus-visible:text-navy/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative transition-transform duration-200 group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5 motion-reduce:transform-none">
                    {pillar.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <HeroIllustration />

      <div className="relative z-20 top-[-4rem]">
        <BrandLockup priority size="hero" />
      </div>

      <h2 className="relative z-20 mt-12 max-w-[18ch] font-serif text-[clamp(2.6rem,5.4vw,4.2rem)] font-semibold leading-[1.02] tracking-normal text-navy sm:mt-10">
        The bridge where the world crosses into China.
      </h2>

      <div className="relative z-20 mt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink">A Three-Week China Innovation Immersion</p>
        <span className="mt-2 block h-[3px] w-24 bg-marigold" />
      </div>

      <div className="relative z-20 mt-12">
        <a className="btn-navy magnetic" href={applyPath}>
          Apply to Participate
        </a>
      </div>

      <div className="absolute bottom-16 left-6 right-6 z-20 flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.28em] text-ink sm:left-10 sm:right-10 lg:left-20 lg:right-20">
        <p>
          Nov.1 - Nov.21, 2026 <span className="text-ink/40">/</span> Shanghai, China
        </p>
        <p className="hidden tracking-[0.35em] text-ink/40 md:block">Exhibit No. 01 / 07</p>
      </div>

      <a className="sr-only" href={mailto}>
        Email The Arch.
      </a>
    </section>
  );
}
