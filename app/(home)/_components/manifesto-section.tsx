import { thesisTags } from "../_data/home-data";

export function ManifestoSection() {
  return (
    <section id="thesis" className="arch-section">
      <div className="arch-wrap">
        <div className="reveal mb-16 flex items-start justify-between">
          <span className="arch-eyebrow">The Thesis</span>
          <span className="arch-exhibit">04 / 07</span>
        </div>

        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <h2 className="reveal font-serif text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-none tracking-normal text-navy">
            <span className="block">Not a tour.</span>
            <span className="mt-2 block">
              A{" "}
              <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:-z-10 after:h-[0.24em] after:bg-marigold">
                working bridge
              </span>
              .
            </span>
          </h2>

          <p className="reveal mt-10 max-w-xl text-sm leading-8 text-ink/75">
            A tour walks you past the glass and hands you a stack of photos. We take the glass away and put you across the
            table from the people building this technology. What crosses this bridge is what counts: contracts, hires,
            partnerships. Whatever crosses, we publish.
          </p>

          <ul className="reveal mt-12 flex flex-wrap items-center justify-center gap-4">
            {thesisTags.map(([code, label]) => (
              <li
                key={code}
                className="tag flex items-center gap-3 rounded-lg border border-ink bg-ivory px-4 py-2.5 transition hover:-translate-y-1 hover:-rotate-1 hover:shadow-[4px_4px_0_0_var(--ink)]"
              >
                <span className="font-mono text-sm font-semibold uppercase tracking-[0.15em] text-navy">{code}</span>
                <span className="h-4 w-px bg-ink/30" />
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink/70">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
