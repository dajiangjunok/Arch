import { weeks } from "../_data/home-data";

export function WeeksSection() {
  return (
    <section id="weeks" className="paper-texture relative border-b border-line px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.36em] text-sun">Thematic weeks</p>
            <h2 className="mt-4 font-poster text-6xl uppercase leading-none tracking-[0.08em] text-ink sm:text-8xl">
              Three gates into China tech
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-ink-soft">
              约 60 人常驻，按周轮换，总参与规模约 100 人。每周独立成章，也可以连成完整三周沉浸。
            </p>
          </div>

          <div className="space-y-5">
            {weeks.map((week) => (
              <article key={week.label} className="week-card relative overflow-hidden border border-line bg-cloud p-6 sm:p-8">
                <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-sun">
                      {week.label} / {week.dates}
                    </div>
                    <h3 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">{week.title}</h3>
                  </div>
                  <ul className="grid gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
                    {week.points.map((point) => (
                      <li key={point} className="flex items-center gap-3">
                        <span className="h-2 w-2 bg-sun" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
