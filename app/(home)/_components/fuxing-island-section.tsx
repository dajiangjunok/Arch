import { audiences, cityNodes } from "../_data/home-data";

function IslandSystem() {
  return (
    <div className="island-system absolute inset-0" aria-hidden>
      <div className="river-field river-west" />
      <div className="river-field river-east" />
      <div className="island-outline" />
      <div className="island-sun" />
      <div className="island-bridge" />
      <div className="island-routes">
        {cityNodes.map((node, index) => (
          <span key={node} className={`island-node island-node-${index}`}>
            {node}
          </span>
        ))}
      </div>
      <div className="island-key">
        <span>Connect</span>
        <span>Collaborate</span>
        <span>Co-create</span>
        <span>Transform</span>
      </div>
    </div>
  );
}

export function FuxingIslandSection() {
  return (
    <section className="relative border-b border-line bg-ink py-16 text-paper sm:py-24">
      <IslandSystem />
      <div className="relative mx-auto grid max-w-[1500px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.36em] text-sun">Why Fuxing Island</p>
          <h2 className="mt-4 font-serif text-[clamp(2.8rem,6vw,6.4rem)] leading-[0.92]">
            The island is already a bridge.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {audiences.map((item) => (
            <article key={item.title} className="border border-paper/25 bg-paper/10 p-6 backdrop-blur-sm">
              <h3 className="font-poster text-4xl uppercase tracking-[0.08em] text-sun">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-paper/82">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
