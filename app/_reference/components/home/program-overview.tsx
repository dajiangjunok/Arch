import Link from "next/link";
import { ArchImage, PhotoTile } from "../shared";
import { HeroSurface } from "../interactive";
import { homeHero } from "../../data/home-page";

export function ProgramOverview() {
  return (
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
          <h2 className="hero-h1">
            A bridge is worth
            <br />
            what <em>crosses</em> it.
          </h2>
          <div className="hero-meta">
            <span className="meta-pill">Shanghai + Beijing + Hangzhou + Shenzhen</span>
            <span className="meta-pill">20–30 residents per week</span>
            <span className="meta-pill">Application Only</span>
          </div>
          <div className="hero-cta">
            <Link
              className="btn btn-fill"
              href="/apply?pass=single_week"
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
  );
}
