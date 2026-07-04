import Image from "next/image";

const journey = [
  {
    verb: "Build",
    text: "Everything begins with an idea.",
    detail: "Founder-quality conversations before the first meeting.",
  },
  {
    verb: "Connect",
    text: "Ideas grow through people.",
    detail: "Screened founders, investors, operators and lab leads.",
  },
  {
    verb: "Discover",
    text: "Perspective changes everything.",
    detail: "Inside China's AI, robotics and intelligent hardware frontier.",
  },
  {
    verb: "Immerse",
    text: "Step in. Learn. Create together.",
    detail: "Closed-door lab visits, dinners and working sessions.",
  },
  {
    verb: "Grow",
    text: "Great companies are not built alone.",
    detail: "Supply chain, talent, capital and market access.",
  },
  {
    verb: "Join",
    text: "Cross the bridge. Build what's next.",
    detail: "Three themed weeks on Shanghai's Fuxing Island.",
  },
];

const audiences = [
  {
    title: "Founders",
    copy: "Find supply chains, talent and technical partners with people who can move the work forward.",
  },
  {
    title: "Investors",
    copy: "See the companies, labs and operators shaping China's applied AI and robotics markets.",
  },
  {
    title: "Institutions",
    copy: "Turn close-range observation into strategy, research agendas and long-term partnerships.",
  },
  {
    title: "China partners",
    copy: "Meet high-signal overseas visitors without sending your team on another outbound roadshow.",
  },
];

const weeks = [
  {
    label: "Week 1",
    dates: "Nov 1 - Nov 8",
    title: "AI Application Frontier",
    points: ["AI consumer products", "Model ecosystem", "Agent co-building workshop"],
  },
  {
    label: "Week 2",
    dates: "Nov 8 - Nov 15",
    title: "Robotics & Embodied Intelligence",
    points: ["Robot labs", "Industrial demos", "Founder and operator salons"],
  },
  {
    label: "Week 3",
    dates: "Nov 15 - Nov 21",
    title: "Hardware, Supply Chain & Scale",
    points: ["Smart hardware", "Manufacturing access", "Go-global partnerships"],
  },
];

const cityNodes = ["SFO", "LON", "AMS", "DXB", "SIN", "TOK", "SHA"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper text-ink">
      <section className="hero-shell paper-texture relative min-h-[88svh] border-b border-line">
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

        <div className="relative z-20 mx-auto grid max-w-[1500px] gap-8 px-5 pb-14 pt-4 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:px-12 lg:pt-8">
          <div className="max-w-3xl">
            <p className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.42em] text-ink-soft">
              A three-week China innovation immersion
            </p>
            <h1 className="font-serif text-[clamp(3.1rem,8vw,8.8rem)] leading-[0.9] tracking-normal text-ink">
              Where the World Meets China&apos;s Innovation Ecosystem
            </h1>
            <div className="mt-8 h-1 w-16 bg-sun" />
            <p className="mt-8 max-w-xl text-lg leading-8 text-ink-soft sm:text-xl">
              走进上海复兴岛，进入中国顶尖 AI、机器人与智能硬件企业的内部场域。这里不是观光行程，而是一座把创始人、投资人、机构和一线研发资源接起来的桥。
            </p>
          </div>

          <div className="relative min-h-[430px] lg:min-h-[560px]">
            <div className="absolute inset-x-0 top-8 z-0 mx-auto h-72 w-72 rounded-full bg-sun opacity-95 blur-[1px] sm:h-[30rem] sm:w-[30rem]" />
            <div className="route-map absolute left-0 right-0 top-4 z-10 mx-auto hidden h-80 max-w-3xl lg:block">
              {cityNodes.map((node, index) => (
                <span key={node} className={`city-node city-node-${index}`}>
                  {node}
                </span>
              ))}
            </div>
            <div className="poster-window absolute inset-x-0 bottom-0 z-20 overflow-hidden border border-line bg-cloud shadow-ticket">
              <Image
                src="/reference/img1.png"
                alt="AI.X Assembly reference bridge panorama"
                width={1942}
                height={809}
                priority
                className="h-full min-h-[360px] w-full object-cover object-center opacity-95"
              />
            </div>
          </div>
        </div>

        <div aria-hidden className="bridge-band">
          <div className="bridge-deck" />
          <div className="bridge-arch arch-one" />
          <div className="bridge-arch arch-two" />
          <div className="bridge-arch arch-three" />
          <span className="walker walker-a" />
          <span className="walker walker-b" />
          <span className="walker walker-c" />
        </div>
      </section>

      <section id="journey" className="paper-texture relative border-b border-line px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.36em] text-sun">Bridge sequence</p>
              <h2 className="mt-4 max-w-4xl font-poster text-6xl uppercase leading-[0.9] tracking-[0.08em] text-ink sm:text-8xl">
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
                <h3 className="font-poster text-5xl uppercase leading-none tracking-[0.1em] text-ink sm:text-6xl">
                  {item.verb}
                </h3>
                <p className="mt-5 max-w-[15rem] font-serif text-2xl leading-tight text-ink">
                  {item.text.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-sun">{item.text.split(" ").slice(-1)}</span>
                </p>
                <p className="mt-6 max-w-[15rem] text-sm leading-6 text-ink-soft">{item.detail}</p>
                <div className="absolute bottom-8 left-6 h-1 w-9 bg-sun transition-all duration-500 group-hover:w-20" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-line bg-ink py-16 text-paper sm:py-24">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/reference/img2.png"
            alt=""
            width={1983}
            height={793}
            className="h-full w-full object-cover"
          />
        </div>
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
        <div className="collage-panel relative min-h-[620px] bg-ink">
          <Image
            src="/reference/img5.jpg"
            alt="AI.X Assembly collage poster"
            width={1440}
            height={2034}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-8 left-8 right-8 border border-paper/40 bg-paper/88 p-5 text-ink shadow-ticket backdrop-blur">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-sun">Fuxing Island, Shanghai</p>
            <p className="mt-3 font-serif text-3xl leading-tight">Closed-door access, curated peers, direct introductions.</p>
          </div>
        </div>
      </section>

      <section id="apply" className="paper-texture relative px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1fr_0.58fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.36em] text-sun">Join AI.X Assembly</p>
            <h2 className="font-poster text-[clamp(4rem,12vw,13rem)] uppercase leading-[0.82] tracking-[0.08em] text-ink">
              Cross the bridge
            </h2>
          </div>
          <div className="border border-line bg-cloud p-6 shadow-ticket sm:p-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink">Nov 1 - Nov 21, 2026</p>
            <p className="mt-5 text-lg leading-8 text-ink-soft">
              For founders, investors, researchers, operators, corporates and builders who need direct access to China&apos;s applied innovation ecosystem.
            </p>
            <a
              href="mailto:hello@aixassembly.com?subject=AI.X%20Assembly%20Application"
              className="mt-8 inline-flex w-full items-center justify-center bg-ink px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-paper transition hover:bg-sun hover:text-ink focus:outline-none focus:ring-4 focus:ring-sun/40 sm:w-auto"
            >
              Request invitation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
