function SiteHeader() {
  return (
    <header className="relative z-30 flex items-start justify-between px-5 py-5 sm:px-8 lg:px-12">
      <a
        className="font-poster text-3xl tracking-[0.16em] text-ink sm:text-5xl"
        href="#"
      >
        Arch<span className="text-sun">.</span>ai
      </a>
      <nav className="hidden gap-8 font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-ink sm:flex">
        <a href="#journey">Journey</a>
        <a href="#weeks">Weeks</a>
        <a href="#apply">Apply</a>
      </nav>
      <div className="text-right font-mono text-[10px] font-bold uppercase leading-5 tracking-[0.28em] sm:text-xs">
        Shanghai
        <br />
        Nov 1 - Nov 21
        <br />
        2026
      </div>
    </header>
  )
}

const heroDetails = [
  {
    label: 'Dates',
    value: 'Nov 1 - 21',
    detail: 'Three-week immersion',
  },
  {
    label: 'Base',
    value: 'Fuxing Island',
    detail: 'Shanghai innovation field',
  },
  {
    label: 'Focus',
    value: 'AI / Robotics / Hardware',
    detail: 'Labs, founders, supply chains',
  },
  {
    label: 'Access',
    value: 'By invitation',
    detail: 'Curated global cohort',
  },
]

export function HeroSection() {
  return (
    <section className="hero-shell relative min-h-[100svh] overflow-hidden border-b border-line bg-paper">
      <div
        className="hero-reference-image absolute inset-0"
        role="img"
        aria-label="Bridge leading global builders into Shanghai's innovation skyline"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,235,220,0.96)_0%,rgba(242,235,220,0.88)_28%,rgba(242,235,220,0.46)_58%,rgba(242,235,220,0.1)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-paper via-paper/72 to-transparent" />

      <SiteHeader />

      <div className="relative z-20 mx-auto flex min-h-[calc(100svh-98px)] max-w-[1500px] flex-col justify-between px-5 pb-6 pt-8 sm:px-8 lg:px-12 lg:pb-10 lg:pt-12">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <div className="hero-copy max-w-3xl">
            <p className="mb-5 max-w-fit border-y border-ink bg-sun px-3 py-2 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.32em] text-ink sm:text-xs">
              A three-week China innovation immersion
            </p>
            <h1 className="text-ink">
              <span className="block font-serif text-[clamp(2.55rem,5.2vw,6rem)] leading-[0.98]">
                Where global builders
              </span>
              <span className="block font-poster text-[clamp(4rem,10.2vw,10.5rem)] uppercase leading-[0.78] tracking-[0.06em]">
                Cross
              </span>
              <span className="grid max-w-2xl grid-cols-[auto_minmax(3rem,1fr)] items-center gap-4">
                <span className="font-poster text-[clamp(2.7rem,6.4vw,6.8rem)] uppercase leading-[0.82] tracking-[0.06em]">
                  Into China
                </span>
                <span aria-hidden className="h-[2px] bg-ink" />
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-ink-soft sm:text-xl">
              走进上海复兴岛，进入中国顶尖 AI、机器人与智能硬件企业的内部场域。这里不是观光行程，而是一座把创始人、投资人、机构和一线研发资源接起来的桥。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:hello@arch.ai?subject=Arch.ai%20Application"
                className="inline-flex items-center justify-center bg-ink px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.26em] text-paper transition hover:bg-sun hover:text-ink focus:outline-none focus:ring-4 focus:ring-sun/40"
              >
                Request invitation
              </a>
              <a
                href="#journey"
                className="inline-flex items-center justify-center border border-ink/30 bg-paper/70 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.26em] text-ink backdrop-blur transition hover:border-ink hover:bg-cloud focus:outline-none focus:ring-4 focus:ring-sun/35"
              >
                View journey
              </a>
            </div>
          </div>

          <div className="hidden min-h-[38rem] lg:block">
            <div className="ml-auto grid w-32 gap-3 border-l border-ink/20 pl-5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-ink-soft">
              <span>Shanghai</span>
              <span className="h-12 w-px bg-sun" />
              <span>Global route</span>
              <span>Applied frontier</span>
            </div>
          </div>
        </div>

        <div className="hero-detail-strip mt-14 grid gap-px overflow-hidden border-y border-line bg-line/70 text-ink shadow-ticket sm:grid-cols-2 lg:grid-cols-4">
          {heroDetails.map((item) => (
            <article key={item.label} className="min-h-32 bg-cloud/90 p-5 backdrop-blur sm:p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-sun">{item.label}</p>
              <h2 className="mt-3 font-poster text-[clamp(1.7rem,2.7vw,3.15rem)] uppercase leading-none tracking-[0.08em]">
                {item.value}
              </h2>
              <p className="mt-4 font-mono text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-ink-soft">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
