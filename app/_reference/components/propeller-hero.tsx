import Link from "next/link";

function RouteMark({
  x,
  y,
  label,
  anchor = "middle",
}: {
  x: number;
  y: number;
  label: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <g>
      <circle cx={x} cy={y} r="3.4" fill="var(--navy)" />
      <circle
        cx={x}
        cy={y}
        r="8"
        fill="none"
        stroke="var(--navy)"
        strokeWidth="1"
        opacity=".45"
      />
      <text
        x={x}
        y={y - 12}
        textAnchor={anchor}
        fontFamily="IBM Plex Mono, monospace"
        fontSize="10.5"
        letterSpacing="1.5"
        fill="var(--ink)"
      >
        {label}
      </text>
    </g>
  );
}

function BridgeIllustration() {
  return (
    <svg
      viewBox="0 0 940 720"
      role="img"
      aria-label="Travel-poster collage: a marigold arched bridge with flight paths converging on Shanghai."
    >
      <defs>
        <clipPath id="ph-sun-crop">
          <rect width="940" height="720" />
        </clipPath>
      </defs>
      <g className="ph-px-sun" clipPath="url(#ph-sun-crop)">
        <circle cx="815" cy="150" r="360" fill="var(--marigold)" />
        <circle
          cx="815"
          cy="150"
          r="360"
          fill="none"
          stroke="var(--ivory)"
          strokeWidth="2"
          opacity=".18"
        />
      </g>
      <g
        fill="none"
        stroke="var(--navy)"
        strokeWidth="1.2"
        strokeDasharray="1 7"
        strokeLinecap="round"
        opacity=".8"
      >
        <path className="ph-flight" d="M 96 150 Q 264.4 328.1 508 356" />
        <path className="ph-flight" d="M 180 96 Q 291.8 291.8 508 356" />
        <path className="ph-flight" d="M 288 74 Q 331.8 266.7 508 356" />
        <path className="ph-flight" d="M 60 300 Q 273.6 411.3 508 356" />
        <path className="ph-flight" d="M 150 452 Q 350.8 485.1 508 356" />
        <path className="ph-flight" d="M 372 508 Q 479.5 467.3 508 356" />
        <path className="ph-flight" d="M 690 470 Q 628.6 365.7 508 356" />
        <path className="ph-flight" d="M 760 214 Q 597.1 219.5 508 356" />
      </g>
      <g>
        <RouteMark x={96} y={150} label="LON" />
        <RouteMark x={180} y={96} label="PAR" />
        <RouteMark x={288} y={74} label="AMS" />
        <RouteMark x={60} y={300} label="SFO" anchor="end" />
        <RouteMark x={150} y={452} label="DXB" anchor="end" />
        <RouteMark x={372} y={508} label="SIN" />
        <RouteMark x={690} y={470} label="SYD" />
        <RouteMark x={760} y={214} label="TOK" anchor="start" />
      </g>
      <g className="ph-px-bridge" transform="rotate(-1 470 470)">
        <path
          d="M 120 560 A 370 384 0 0 1 860 560"
          fill="none"
          stroke="var(--ivory)"
          strokeWidth="46"
        />
        <path
          d="M 120 560 A 370 384 0 0 1 860 560"
          fill="none"
          stroke="var(--marigold)"
          strokeWidth="34"
        />
        <path
          d="M 120 560 A 370 384 0 0 1 860 560"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.5"
          opacity=".25"
        />
        <g stroke="var(--ink)" strokeWidth="1.4" opacity=".55">
          <line x1="180" y1="350.3" x2="180" y2="560" />
          <line x1="268" y1="252.8" x2="268" y2="560" />
          <line x1="356" y1="202.1" x2="356" y2="560" />
          <line x1="444" y1="179" x2="444" y2="560" />
          <line x1="532" y1="178.5" x2="532" y2="560" />
          <line x1="620" y1="200.5" x2="620" y2="560" />
          <line x1="708" y1="249.7" x2="708" y2="560" />
          <line x1="796" y1="344.1" x2="796" y2="560" />
        </g>
        <path d="M 40 560 L 900 559 L 900 588 L 40 588 Z" fill="var(--navy)" />
        <rect x="40" y="558" width="860" height="3" fill="var(--ink)" opacity=".4" />
        <rect x="118" y="560" width="16" height="120" fill="var(--navy)" />
        <rect x="846" y="560" width="16" height="120" fill="var(--navy)" />
        <g transform="translate(470 552) scale(1.15)" fill="var(--ink)">
          <circle cy="-17" r="3.6" />
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
        <text x="530" y="360" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="2" fill="var(--ink)" opacity=".7">
          SHANGHAI
        </text>
      </g>
    </svg>
  );
}

export function PropellerHero() {
  return (
    <section id="top" className="ph-hero" data-ph-hero>
      <div className="ph-hero-illo" aria-hidden="true">
        <div className="ph-hero-illo-inner"><BridgeIllustration /></div>
      </div>
      <div className="ph-wordmark">
        <div className="ph-wordmark-icon"><img src="/logo.png" alt="The Arch logo" /></div>
        <div className="ph-wordmark-divider" />
        <div>
          <h1>THE ARCH</h1>
          <span className="ph-wordmark-rule" />
          <p>A bridge is worth what crosses it.</p>
        </div>
      </div>
      <h2 className="ph-hero-headline">The bridge where the world crosses <em>into China.</em></h2>
      <div className="ph-hero-label">
        <p>A Three-Week China Innovation Immersion</p>
        <span />
      </div>
      <div className="ph-hero-cta">
        <Link className="ph-btn-navy" href="/apply?pass=single_week">Apply to Participate</Link>
        <Link className="ph-btn-line" href="#weeks">See the three weeks ↓</Link>
      </div>
      <div className="ph-hero-bottom">
        <p>Nov.1 — Nov.21, 2026 <span className="ph-slash">/</span> Shanghai, Beijing, Hangzhou &amp; Shenzhen</p>
        <p className="ph-exno">Application Only</p>
      </div>
    </section>
  );
}
