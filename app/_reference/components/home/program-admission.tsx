import Link from "next/link";
import type { ReactNode } from "react";
import { CornerStamp, SectionHeading } from "../shared";
import { RevealSection } from "../interactive";
import { singleWeekBenefits } from "../../data/home-page";
import { FellowshipPass } from "./fellowship-pass";

function AdmissionCard({
  variant,
  kicker,
  title,
  description,
  audiences,
  children,
}: {
  variant: "single" | "fellow";
  kicker: string;
  title: string;
  description: string;
  audiences: readonly string[];
  children: ReactNode;
}) {
  return (
    <article className={`price-card ${variant} tick-corner`}>
      <CornerStamp />
      <p className="kicker">{kicker}</p>
      <h3>{title}</h3>
      <p className="card-hook">{description}</p>
      <div className="for-row">
        <span className="for-label">For</span>
        {audiences.map((audience) => (
          <span className="for-tag" key={audience}>{audience}</span>
        ))}
      </div>
      {children}
    </article>
  );
}

export function ProgramAdmission() {
  return (
    <RevealSection id="pricing" className="price-sec">
      <div className="wrap">
        <SectionHeading eyebrow="Admission" title={["How to", "Join"]} index="04" />
        <div className="price-grid">
          <AdmissionCard
            variant="single"
            kicker="Single Week"
            title="Choose Week 1, 2, or 3"
            description="Seven days inside the rooms most people only read about afterward."
            audiences={["Founders", "Investors", "Executives", "Institutions"]}
          >
            <div className="incl-block">
              <p className="incl-heading">Included</p>
              <ul className="incl-mini">
                {singleWeekBenefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
              </ul>
            </div>
            <div className="fee-stack">
              <div className="fee-row fee-row-active">
                <span className="lbl">
                  Early Adopter <span className="fee-badge">Open Now</span>
                </span>
                <span className="fee fee-contact">Contact Us for Pricing</span>
              </div>
            </div>
            <Link className="btn" href="/apply?pass=single_week">Apply →</Link>
          </AdmissionCard>
          <AdmissionCard
            variant="fellow"
            kicker="Limited · Fellowship Program"
            title="Fellowship: The Arch Roamer"
            description="Live, work and build in Shanghai with a global community."
            audiences={["Indie Hackers", "Solo Builders", "Remote Pros", "Makers"]}
          >
            <FellowshipPass />
          </AdmissionCard>
        </div>
        <p className="pricing-note">
          Choose any 1, 2, or all 3 weeks when you apply. For group bookings,
          write to us for a quote.
        </p>
      </div>
    </RevealSection>
  );
}
