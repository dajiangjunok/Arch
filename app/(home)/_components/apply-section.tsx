export function ApplySection() {
  return (
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
            For founders, investors, researchers, operators, corporates and builders who need direct access to China&apos;s
            applied innovation ecosystem.
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
  );
}
