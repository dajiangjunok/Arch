import { ApplicationForm } from "./application-form";

export function ApplySection() {
  return (
    <section id="apply" className="paper-texture relative px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-start">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.36em] text-sun">Join Arch.ai</p>
          <h2 className="font-poster text-[clamp(2.5rem,10vw,6rem)] uppercase leading-[0.82] tracking-[0.08em] text-ink">
            Cross the bridge
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
            Apply for the Shanghai immersion. Approved applicants receive a dedicated Stripe Checkout link from the
            Arch.ai team.
          </p>
        </div>
        <div className="border border-line bg-cloud p-6 shadow-ticket sm:p-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink">Nov 1 - Nov 21, 2026</p>
          <p className="mt-5 text-lg leading-8 text-ink-soft">
            For founders, investors, researchers, operators, corporates and builders who need direct access to China&apos;s
            applied innovation ecosystem.
          </p>
          <div className="mt-8">
            <ApplicationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
