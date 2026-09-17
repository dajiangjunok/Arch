import { SectionHeading } from "../shared";
import { RevealSection } from "../interactive";
import { programStats } from "../../data/home-page";

export function ProgramStats() {
  return (
    <RevealSection className="stats-sec">
      <div className="wrap">
        <SectionHeading
          eyebrow="The Program, By the Numbers"
          title={["Three Weeks,", "One Bridge"]}
        />
        <div className="stats-grid">
          {programStats.map((stat, index) => (
            <div className={`stat-block sb${index + 1}`} key={stat.label[0]}>
              <span className="stat-num">
                {stat.value}
                {"suffix" in stat ? (
                  <span className="stat-plus">{stat.suffix}</span>
                ) : null}
              </span>
              <span className="stat-label">
                {stat.label[0]}
                <br />
                {stat.label[1]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
