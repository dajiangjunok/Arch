import { SectionHeading } from "../shared";
import { CompanyCard, RevealSection } from "../interactive";
import { homeCompanies, homeMarquee } from "../../data/home-page";

export function CompanyWall() {
  return (
    <RevealSection className="stampwall-sec">
      <div className="blob-field">
        <div
          className="blob blob-soft"
          style={{
            width: "20rem",
            height: "20rem",
            right: "-2rem",
            top: "-4rem",
            background:
              "radial-gradient(circle,var(--marigold) 0%,transparent 70%)",
            opacity: 0.28,
          }}
        />
        <div
          className="blob blob-soft"
          style={{
            width: "16rem",
            height: "16rem",
            left: "-4rem",
            bottom: "-4rem",
            background:
              "radial-gradient(circle,var(--harbor) 0%,transparent 70%)",
            opacity: 0.3,
          }}
        />
      </div>
      <div className="wrap">
        <SectionHeading
          eyebrow="Across All Three Weeks · Click to Flip"
          title={["The Company Wall"]}
          index="02"
        />
        <div className="stampwall">
          {homeCompanies.map((company) => (
            <CompanyCard key={company.name} company={company} />
          ))}
        </div>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {homeMarquee.map((name, index) => (
              <span className="marquee-item" key={`${name}-${index}`}>
                <span className="dot" />
                {name}
              </span>
            ))}
          </div>
        </div>
        <p className="marquee-hint">
          ↑ Hover to see the full collection scroll by
        </p>
      </div>
    </RevealSection>
  );
}
