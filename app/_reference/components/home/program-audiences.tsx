import Link from "next/link";
import { SectionHeading } from "../shared";
import { RevealSection } from "../interactive";
import { audiences } from "../../data/home-page";

export function ProgramAudiences() {
  return (
    <RevealSection id="audiences" className="sec">
      <div className="wrap">
        <SectionHeading
          eyebrow="Who It's For"
          title={["Built For Three"]}
          index="03"
        />
        <div className="audience-grid">
          {audiences.map((audience) => (
            <Link
              className={`audience-block ${audience.className}`}
              href="/apply?pass=single_week"
              key={audience.title}
            >
              <span className="tag">{audience.tag}</span>
              <h3>{audience.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
