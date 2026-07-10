import { audiences, mailto } from "../_data/home-data";
import { SectionHeading } from "./section-heading";

const audienceClasses = {
  navy: "bg-navy text-ivory",
  "navy-alt": "bg-navy text-marigold",
  marigold: "bg-marigold text-ink",
  ivory: "bg-ivory text-navy",
};

const arrowClasses = {
  navy: "stroke-marigold",
  "navy-alt": "stroke-marigold",
  marigold: "stroke-navy",
  ivory: "stroke-navy",
};

export function AudienceSection() {
  return (
    <section id="audiences" className="arch-section pb-0">
      <div className="arch-wrap">
        <SectionHeading eyebrow="Who It's For" title="Built For Four" exhibit="05 / 07" />
      </div>

      <div className="grid gap-0.5 bg-ink md:grid-cols-2">
        {audiences.map((audience, index) => (
          <a
            key={audience.title}
            href={mailto}
            className={`audience-block group flex min-h-[280px] flex-col justify-between overflow-hidden p-8 sm:p-10 lg:min-h-[320px] ${
              audienceClasses[audience.tone as keyof typeof audienceClasses]
            } ${index === 0 || index === 3 ? "md:min-h-[360px]" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
                {audience.detail}
              </span>
              <svg
                className={`h-6 w-6 shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1 ${
                  arrowClasses[audience.tone as keyof typeof arrowClasses]
                }`}
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M7 17 L17 7 M9 7 h8 v8" />
              </svg>
            </div>
            <h3 className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-none tracking-normal">
              {audience.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}
