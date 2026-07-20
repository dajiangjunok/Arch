import { admissionPasses } from "../_data/home-data";
import { SectionHeading } from "./section-heading";

const ticketClasses = {
  ivory: "bg-card text-ink",
  marigold: "bg-marigold text-ink",
  navy: "ticket-navy bg-navy text-ivory",
};

function Barcode() {
  const bars = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1];

  return (
    <div className="barcode flex h-9 items-end gap-0.5 text-ink" aria-hidden="true">
      {bars.map((width, index) => (
        <span
          key={`${width}-${index}`}
          style={{
            width,
            height: `${70 + ((index * 13) % 30)}%`,
          }}
        />
      ))}
    </div>
  );
}

export function AdmissionSection() {
  return (
    <section id="admission" className="arch-section arch-wrap">
      <SectionHeading eyebrow="Admission" title="Choose Your Pass" exhibit="06 / 07" />

      <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-10">
        {admissionPasses.map((pass) => (
          <article
            key={pass.code}
            className={`ticket shadow-ink relative rounded-[14px] transition hover:-translate-y-1 hover:rotate-0 hover:shadow-[10px_12px_0_0_var(--ink)] ${
              ticketClasses[pass.tone as keyof typeof ticketClasses]
            } ${pass.rotate} reveal`}
          >
            <div className="flex items-start justify-between px-7 pt-7">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-65">{pass.code}</span>
              {pass.badge ? (
                <span className="rotate-6 rounded bg-marigold px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink shadow-[3px_3px_0_0_var(--ink)]">
                  {pass.badge}
                </span>
              ) : null}
            </div>
            <div className="px-7 pt-6">
              <h3 className="font-serif text-3xl font-semibold leading-tight">{pass.name}</h3>
              {/* <p className="mt-4 font-serif text-3xl font-semibold leading-none">{pass.price}</p> */}
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em]">{pass.duration}</p>
              <p className="mt-1 text-sm leading-6 opacity-65">{pass.note}</p>
            </div>

            <div className="relative my-6">
              <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ivory" />
              <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ivory" />
              <div className="mx-5 border-t border-dashed border-current/25" />
            </div>

            <ul className="grid gap-3 px-7">
              {pass.inclusions.map((item) => (
                <li key={item} className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.12em]">
                  <span className={`h-1.5 w-1.5 shrink-0 ${pass.tone === "navy" ? "bg-marigold" : "bg-navy"}`} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 px-7 pb-7">
              <div className="flex items-center justify-between border-t border-current/20 pt-5">
                <Barcode />
                <a className={`reserve font-mono text-xs font-semibold uppercase tracking-[0.2em] ${pass.tone === "navy" ? "text-marigold" : "text-navy"}`} href={`/apply?pass=${pass.ticketId}`}>
                  Apply <span className="arr" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
