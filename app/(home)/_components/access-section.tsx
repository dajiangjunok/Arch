import { accessTickets } from "../_data/home-data";

function AccessCollage() {
  return (
    <div className="collage-panel relative min-h-[620px] overflow-hidden bg-ink">
      <div className="access-collage" role="img" aria-label="Layered AI.X Assembly access passes and bridge collage">
        <div className="collage-map map-one" />
        <div className="collage-map map-two" />
        <div className="collage-bridge">
          <span className="suspension-tower tower-left" />
          <span className="suspension-tower tower-right" />
          <span className="suspension-cable cable-main" />
          <span className="suspension-cable cable-sub" />
          <span className="bridge-road" />
        </div>
        {accessTickets.map((ticket, index) => (
          <article key={ticket.code} className={`travel-ticket ticket-${index} ticket-${ticket.tone}`}>
            <p>AI.X Assembly</p>
            <strong>{ticket.code}</strong>
            <span>{ticket.city}</span>
            <small>{ticket.detail}</small>
          </article>
        ))}
        <div className="arrival-stamp">
          <span>Arrived</span>
          <strong>01 Nov 2026</strong>
          <small>Shanghai China</small>
        </div>
        <div className="yellow-note">
          <span>Access to innovation</span>
          <strong>
            连接世界
            <br />
            共建未来
          </strong>
        </div>
        <div className="skyline-cut">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="absolute bottom-8 left-8 right-8 border border-paper/40 bg-paper/90 p-5 text-ink shadow-ticket backdrop-blur">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-sun">Fuxing Island, Shanghai</p>
        <p className="mt-3 font-serif text-3xl leading-tight">Closed-door access, curated peers, direct introductions.</p>
      </div>
    </div>
  );
}

export function AccessSection() {
  return (
    <section className="relative grid min-h-[760px] overflow-hidden border-b border-line bg-paper lg:grid-cols-[1.05fr_0.95fr]">
      <div className="paper-texture relative flex flex-col justify-between px-5 py-14 sm:px-8 lg:px-12">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.36em] text-sun">Access to innovation</p>
          <h2 className="mt-4 max-w-4xl font-serif text-[clamp(3rem,7vw,7rem)] leading-[0.92] text-ink">
            Not a tour. A working bridge.
          </h2>
        </div>
        <div className="mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          <p className="text-lg leading-8 text-ink-soft">
            项目把海外参与者带入平时难以安排的中国前沿现场：内部实验室、研发负责人、创始人和本地生态伙伴。
          </p>
          <p className="text-lg leading-8 text-ink-soft">
            参与者最终带走的不是“看过中国科技”，而是真实人脉、可落地合作和对中国模式的结构化判断。
          </p>
        </div>
      </div>
      <AccessCollage />
    </section>
  );
}
