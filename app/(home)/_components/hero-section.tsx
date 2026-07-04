import { cityNodes, labBlocks } from '../_data/home-data'

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

function RouteMap() {
  return (
    <div className="route-map absolute left-0 right-0 top-4 z-10 mx-auto hidden h-80 max-w-3xl lg:block">
      {cityNodes.map((node, index) => (
        <span key={node} className={`city-node city-node-${index}`}>
          {node}
        </span>
      ))}
    </div>
  )
}

function PosterScene() {
  return (
    <div className="poster-window absolute inset-x-0 bottom-0 z-20 overflow-hidden border border-line bg-cloud shadow-ticket">
      <div
        className="poster-scene"
        role="img"
        aria-label="Arch.ai bridge and Shanghai innovation ecosystem illustration"
      >
        <div className="poster-sun" />
        <div className="paper-shard shard-left" />
        <div className="paper-shard shard-right" />
        <div className="poster-dots dots-a" />
        <div className="poster-dots dots-b" />
        <div className="poster-route-line route-a" />
        <div className="poster-route-line route-b" />
        {/* <div className="hero-bridge">
          <span className="hero-arch arch-a" />
          <span className="hero-arch arch-b" />
          <span className="hero-arch arch-c" />
          <span className="bridge-pier pier-a" />
          <span className="bridge-pier pier-b" />
        </div> */}
        <div className="hero-water" />
        <div className="hero-skyline" aria-hidden>
          {labBlocks.map((block, index) => (
            <span key={block} className={`lab-block lab-block-${index}`}>
              {block}
            </span>
          ))}
        </div>
        {/* <div className="poster-walkers" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div> */}
        <div className="poster-caption">
          <span className="brand-case">Arch.ai</span>
          <strong>Access to innovation</strong>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="hero-shell paper-texture relative min-h-[88svh] border-b border-line">
      <SiteHeader />

      <div className="relative z-20 mx-auto grid max-w-[1500px] gap-8 px-5 pb-14 pt-4 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:px-12 lg:pt-8">
        <div className="max-w-3xl">
          <p className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.42em] text-ink-soft">
            A three-week China innovation immersion
          </p>
          <h1 className="max-w-[46rem] text-ink">
            <span className="block font-serif text-[clamp(2.35rem,4.9vw,5.45rem)] leading-[1.02] tracking-normal">
              Where the World
            </span>
            <span className="my-4 grid grid-cols-[auto_minmax(3rem,1fr)] items-center gap-4 sm:my-5">
              <span className="inline-flex border-y-2 border-ink bg-sun px-3 py-2 font-mono text-[clamp(0.72rem,1vw,0.88rem)] font-bold uppercase leading-none tracking-[0.26em] text-ink">
                Meets China&apos;s
              </span>
              <span aria-hidden className="h-[2px] bg-ink" />
            </span>
            <span className="block font-poster text-[clamp(3.1rem,7.2vw,7.2rem)] uppercase leading-[0.84] tracking-[0.05em]">
              Innovation
            </span>
            <span className="block pl-[clamp(0rem,5vw,4rem)] font-poster text-[clamp(2.9rem,6.4vw,6.4rem)] uppercase leading-[0.88] tracking-[0.05em]">
              Ecosystem
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-ink-soft sm:text-xl">
            走进上海复兴岛，进入中国顶尖
            AI、机器人与智能硬件企业的内部场域。这里不是观光行程，而是一座把创始人、投资人、机构和一线研发资源接起来的桥。
          </p>
        </div>

        <div className="relative min-h-[430px] lg:min-h-[560px]">
          <div className="absolute inset-x-0 top-8 z-0 mx-auto h-72 w-72 rounded-full bg-sun opacity-95 blur-[1px] sm:h-[30rem] sm:w-[30rem]" />
          <RouteMap />
          <PosterScene />
        </div>
      </div>
    </section>
  )
}
