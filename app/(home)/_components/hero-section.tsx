import { cityNodes, labBlocks } from "../_data/home-data";

function SiteHeader() {
  return (
    <header className="relative z-30 flex items-start justify-between px-5 py-5 sm:px-8 lg:px-12">
      <a className="font-poster text-3xl uppercase tracking-[0.16em] text-ink sm:text-5xl" href="#">
        AI<span className="text-sun">.</span>X
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
  );
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
  );
}

function PosterScene() {
  return (
    <div className="poster-window absolute inset-x-0 bottom-0 z-20 overflow-hidden border border-line bg-cloud shadow-ticket">
      <div
        className="poster-scene"
        role="img"
        aria-label="AI.X Assembly bridge and Shanghai innovation ecosystem illustration"
      >
        <div className="poster-sun" />
        <div className="paper-shard shard-left" />
        <div className="paper-shard shard-right" />
        <div className="poster-dots dots-a" />
        <div className="poster-dots dots-b" />
        <div className="poster-route-line route-a" />
        <div className="poster-route-line route-b" />
        <div className="hero-bridge">
          <span className="hero-arch arch-a" />
          <span className="hero-arch arch-b" />
          <span className="hero-arch arch-c" />
          <span className="bridge-pier pier-a" />
          <span className="bridge-pier pier-b" />
        </div>
        <div className="hero-water" />
        <div className="hero-skyline" aria-hidden>
          {labBlocks.map((block, index) => (
            <span key={block} className={`lab-block lab-block-${index}`}>
              {block}
            </span>
          ))}
        </div>
        <div className="poster-walkers" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="poster-caption">
          <span>AI.X Assembly</span>
          <strong>Access to innovation</strong>
        </div>
      </div>
    </div>
  );
}

function BridgeBand() {
  return (
    <div aria-hidden className="bridge-band">
      <div className="bridge-deck" />
      <div className="bridge-arch arch-one" />
      <div className="bridge-arch arch-two" />
      <div className="bridge-arch arch-three" />
      <span className="walker walker-a" />
      <span className="walker walker-b" />
      <span className="walker walker-c" />
    </div>
  );
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
          <h1 className="font-serif text-[clamp(2.7rem,6.8vw,7.4rem)] leading-[0.9] tracking-normal text-ink">
            Where the World Meets China&apos;s Innovation Ecosystem
          </h1>
          <div className="mt-8 h-1 w-16 bg-sun" />
          <p className="mt-8 max-w-xl text-lg leading-8 text-ink-soft sm:text-xl">
            走进上海复兴岛，进入中国顶尖 AI、机器人与智能硬件企业的内部场域。这里不是观光行程，而是一座把创始人、投资人、机构和一线研发资源接起来的桥。
          </p>
        </div>

        <div className="relative min-h-[430px] lg:min-h-[560px]">
          <div className="absolute inset-x-0 top-8 z-0 mx-auto h-72 w-72 rounded-full bg-sun opacity-95 blur-[1px] sm:h-[30rem] sm:w-[30rem]" />
          <RouteMap />
          <PosterScene />
        </div>
      </div>

      <BridgeBand />
    </section>
  );
}
