import Link from "next/link";
import {
  ArchImage,
  PhotoTile,
  PriceCards,
  SectionHeading,
} from "./components/shared";
import {
  CompanyCard,
  HeroSurface,
  RevealSection,
} from "./components/interactive";
import {
  audiences,
  homeCompanies,
  homeHero,
  homeMarquee,
  programStats,
  programWeeks,
} from "./data/home-page";
import { PropellerHero } from "./components/propeller-hero";

export function HomePage() {
  return (
    <>
      <PropellerHero />
      <section id="detail-hero" className="hero wrap">
        <div className="hero-grid" style={{ gridTemplateColumns: "1fr" }}>
          <HeroSurface
            background={
              <div className="hero-ghost-photo" aria-hidden="true">
                <ArchImage
                  src="/reference/45609c5450c39032.jpg"
                  alt=""
                  priority
                />
              </div>
            }
          >
            <p className="hero-eyebrow">
              A Three-Week China Innovation Immersion · Nov 1–21
            </p>
            <h1 className="hero-h1">
              A bridge is worth
              <br />
              what <em>crosses</em> it.
            </h1>
            <div className="hero-meta">
              <span className="meta-pill">Shanghai + Beijing + Shenzhen</span>
              <span className="meta-pill">20–30 residents per week</span>
              <span className="meta-pill">Application Only</span>
            </div>
            <div className="hero-cta">
              <Link
                className="btn btn-fill"
                href="/apply?pass=single_week_pass"
              >
                Apply to Participate
              </Link>
              <Link className="btn btn-line" href="#weeks">
                See the three weeks ↓
              </Link>
            </div>
          </HeroSurface>
        </div>
        <div className="moments-strip">
          {homeHero.moments.map((image) => (
            <PhotoTile key={image.label} image={image} className="moment-ph" />
          ))}
        </div>
      </section>

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
            Each week runs as its own gate — apply to one, or join the full
            Fellowship across all three.
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

      <RevealSection id="thesis" className="thesis-sec">
        <div className="blob-field">
          <div className="blob blob-soft thesis-blob" />
        </div>
        <div className="wrap">
          <div className="thesis-wrap">
            <span className="sec-eyebrow thesis-eyebrow">The Thesis</span>
            <h2 className="thesis-title">
              Not a tour.
              <br />A <span className="underline">working bridge</span>.
            </h2>
            <p className="thesis-body">
              A tour walks you past the glass and hands you a stack of photos.
              We take the glass away and put you across the table from the
              people building this technology. What crosses this bridge is what
              counts: contracts, hires, partnerships. Whatever crosses, we
              publish.
            </p>
            <ul className="thesis-tags">
              {[
                "Founder Access",
                "Capital Network",
                "Market Bridge",
                "Hardware Route",
              ].map((tag) => (
                <li className="thesis-tag" key={tag}>
                  <span className="label">{tag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="audiences" className="sec">
        <div className="wrap">
          <SectionHeading
            eyebrow="Who It's For"
            title={["Built For Four"]}
            index="03"
          />
          <div className="audience-grid">
            {audiences.map((audience) => (
              <Link
                className={`audience-block ${audience.className}`}
                href="/apply?pass=single_week_pass"
                key={audience.title}
              >
                <span className="tag">{audience.tag}</span>
                <h3>{audience.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection id="pricing" className="price-sec">
        <div className="wrap">
          <SectionHeading
            eyebrow="Admission"
            title={["Two Ways to", "Join"]}
            index="04"
          />
          <PriceCards />
          <p className="pricing-note">
            All fees in USD. Applying to two or more weeks, or as a group? Write
            to us and we will quote directly.
          </p>
        </div>
      </RevealSection>

      <footer>
        <div className="wrap">
          <p className="foot-tag">A bridge is worth what crosses it.</p>
          <div className="foot-links">
            <Link href="/week1">Week 1 — AI &amp; Model Frontiers</Link>
            <a href="mailto:business@globalpropeller.com">
              business@globalpropeller.com
            </a>
            <Link href="/week3">Week 3 — Smart Hardware &amp; Wearables →</Link>
          </div>
          <div className="foot-links" data-secondary="true">
            <Link href="/week2">
              Week 2 — Embodied AI &amp; Humanoid Robots
            </Link>
            <span>Nov 1 – Nov 21, 2026 · Shanghai, Beijing &amp; Shenzhen</span>
          </div>
        </div>
      </footer>
    </>
  );
}
