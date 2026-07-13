import { programGates } from "../_data/home-data";
import { SectionHeading } from "./section-heading";

const toneClasses = {
  navy: {
    panel: "bg-navy text-ivory",
    accent: "text-marigold",
    rule: "bg-marigold",
    stroke: "var(--marigold)",
    sun: "var(--marigold)",
    land: "var(--ivory)",
  },
  marigold: {
    panel: "bg-marigold text-ink",
    accent: "text-navy",
    rule: "bg-navy",
    stroke: "var(--navy)",
    sun: "var(--navy)",
    land: "var(--ink)",
  },
};

function GateArt({ tone, index }: { tone: keyof typeof toneClasses; index: number }) {
  const colors = toneClasses[tone];

  return (
    <svg className="block h-40 w-full" viewBox="0 0 320 220" aria-hidden="true">
      {index === 2 ? <path d="M0 0 L150 0 L120 220 L0 220 Z" fill={colors.sun} opacity="0.92" /> : null}
      <circle cx={index === 1 ? 20 : 300} cy={index === 1 ? 24 : 26} r={index === 1 ? 82 : 86} fill={colors.sun} opacity="0.95" />
      <path d="M0 150 L48 146 L110 152 L168 145 L232 153 L296 146 L320 151 L320 220 L0 220 Z" fill={colors.land} opacity="0.14" />
      <path d="M40 176 A 120 120 0 0 1 280 176" fill="none" stroke={colors.stroke} strokeWidth="12" />
      <line x1="20" y1="176" x2="300" y2="176" stroke={colors.stroke} strokeWidth="8" />
      <g fill="var(--ink)">
        <circle cx={index === 1 ? 170 : 150} cy="150" r="5" />
        <rect x={index === 1 ? "167.6" : "147.6"} y="155" width="4.8" height="14" />
      </g>
    </svg>
  );
}

export function ProgramGatesSection() {
  return (
    <section id="weeks" className="arch-section arch-wrap">
      <SectionHeading
        eyebrow="Program Structure"
        title="Three Gates Into China Tech"
        exhibit="02 / 07"
        copy="20-30 residents on-site each week · ~60 participants total."
      />

      <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
        {programGates.map((gate, index) => {
          const tone = toneClasses[gate.tone as keyof typeof toneClasses];
          return (
            <article
              key={gate.number}
              className={`torn-soft shadow-ink flex min-h-full flex-col ${tone.panel} ${
                index === 0 ? "-rotate-1" : index === 1 ? "rotate-1" : "-rotate-[0.6deg]"
              }`}
            >
              <GateArt tone={gate.tone as keyof typeof toneClasses} index={index} />
              <div className="flex flex-1 flex-col gap-5 px-7 pb-9 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-75">{gate.week}</span>
                  <span className={`text-2xl font-medium ${tone.accent}`}>{gate.number}</span>
                </div>
                <h3 className="font-serif text-[clamp(1.6rem,2vw,1.9rem)] font-semibold leading-[1.08]">{gate.title}</h3>
                <span className="font-mono text-xs uppercase tracking-[0.25em] opacity-75">{gate.dates}</span>
                <div className={`h-px w-full ${tone.rule}`} />
                <ul className="grid gap-2.5">
                  {gate.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-6">
                      <span className={tone.accent}>-</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
