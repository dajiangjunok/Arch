import Link from "next/link";
import { ArchImage, SectionHeading } from "../shared";
import { RevealSection } from "../interactive";
import { programWeeks } from "../../data/home-page";

export function ProgramWeeks() {
  return (
    <RevealSection id="weeks" className="sec">
      <div className="blob-field">
        <div
          className="blob blob-soft"
          style={{
            width: "24rem",
            height: "24rem",
            left: "-6rem",
            top: 0,
            background:
              "radial-gradient(circle,var(--harbor-soft) 0%,transparent 70%)",
            opacity: 0.45,
          }}
        />
      </div>
      <div className="wrap">
        <SectionHeading
          eyebrow="Program Structure"
          title={["Three Gates", "Into China Tech"]}
          index="01"
        />
        <p className="section-intro">
          Each week runs as its own gate - apply for one, two, or the full three-week program.
        </p>
        <div className="weeks-grid">
          {programWeeks.map((week) => (
            <Link
              className={`week-card ${week.className}`}
              href={week.href}
              key={week.number}
            >
              {"flag" in week ? (
                <span className="wk-flag">{week.flag}</span>
              ) : null}
              <div className="wk-ghost">
                <ArchImage src={week.image} alt="" />
              </div>
              <div className="wk-top">
                <span className="wk-num">{week.number}</span>
              </div>
              <h3>{week.title}</h3>
              <span className="wk-loc">{week.location}</span>
              <hr />
              <ul>
                {week.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <span className="wk-link">See the full week →</span>
            </Link>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
