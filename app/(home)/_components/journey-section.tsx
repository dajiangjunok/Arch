import { journey } from "../_data/home-data";

function JourneyTitle({ text }: { text: string }) {
  const words = text.split(" ");
  const lastWord = words.at(-1);
  const prefix = words.slice(0, -1).join(" ");

  return (
    <>
      {prefix} <span className="text-sun">{lastWord}</span>
    </>
  );
}

export function JourneySection() {
  return (
    <section id="journey" className="paper-texture relative border-b border-line px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.36em] text-sun">Bridge sequence</p>
            <h2 className="mt-4 max-w-4xl font-poster text-6xl uppercase leading-[0.9] tracking-[0.08em] text-ink sm:text-7xl">
              Build the route before the trip begins
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-ink-soft">
            从构想到加入，六个动作对应六种真实连接：筛选、引荐、访问、共创、合作和长期增长。
          </p>
        </div>

        <div className="journey-grid grid border-y border-line lg:grid-cols-6">
          {journey.map((item, index) => (
            <article
              key={item.verb}
              className="group relative min-h-[320px] border-line px-6 py-7 transition duration-500 hover:bg-cloud lg:border-r"
            >
              <div className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.22em]">
                <span className="text-3xl text-sun">{String(index + 1).padStart(2, "0")}</span>
                <span className="ml-2 text-ink">/ 06</span>
              </div>
              <h3 className="font-poster text-5xl uppercase leading-none tracking-[0.1em] text-ink sm:text-4xl">
                {item.verb}
              </h3>
              <p className="mt-5 max-w-[15rem] font-serif text-xl leading-tight text-ink">
                <JourneyTitle text={item.text} />
              </p>
              <p className="mt-6 max-w-[15rem] text-sm leading-6 text-ink-soft">{item.detail}</p>
              <div className="absolute bottom-8 left-6 h-1 w-9 bg-sun transition-all duration-500 group-hover:w-20" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
