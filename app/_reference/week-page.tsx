"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { WeekPageData } from "./types";
import {
  ArchImage,
  PhotoTile,
  PriceCards,
  SectionHeading,
  TextSegments,
} from "./components/shared";
import {
  CompanyCard,
  DossierLink,
  FooterLink,
  GuestCard,
  HeroSurface,
  PillarCard,
  RevealSection,
} from "./components/interactive";

export function WeekPage({ data }: { data: WeekPageData }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [pulsingChip, setPulsingChip] = useState<string | null>(null);
  const day = selectedDay === null ? null : data.days[selectedDay];

  const chooseFromChip = (chip: string) => {
    setPulsingChip(null);
    window.requestAnimationFrame(() => setPulsingChip(chip));
    const index = (data.chipDayMap as Readonly<Record<string, number>>)[chip];
    if (index === undefined) return;
    setSelectedDay(index);
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section id="top" className="hero wrap">
        <div className="hero-grid">
          <HeroSurface>
            <p className="hero-eyebrow">{data.hero.eyebrow}</p>
            <h1 className="hero-h1">
              {data.hero.title}
              <br />
              <em>{data.hero.accent}</em>
            </h1>
            <div className="hero-meta">
              {data.hero.meta.map((item) => (
                <span key={item} className="meta-pill">
                  {item}
                </span>
              ))}
            </div>
            <div className="hero-cta">
              <Link
                className="btn btn-fill"
                href="/apply?pass=single_week_pass"
              >
                Apply for Week {data.weekNumber}
              </Link>
              <DossierLink />
            </div>
          </HeroSurface>
          <div className="hero-stamp">
            <div className="stamp-ghost">
              <ArchImage src={data.hero.stampImage} alt="" priority />
            </div>
            <div>
              <div className="stamp-num">
                {String(data.weekNumber).padStart(2, "0")}
                <span>/03</span>
              </div>
              <div className="stamp-label">{data.hero.stampLabel}</div>
            </div>
            <div className="stamp-days">
              {data.hero.stampStats.map((stat) => (
                <div className="row" key={stat.label}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="moments-strip">
          {data.hero.moments.map((image) => (
            <PhotoTile key={image.label} image={image} className="moment-ph" />
          ))}
        </div>
      </section>

      <RevealSection className="sec wrap">
        <div className="blob-field">
          <div
            className="blob blob-soft"
            style={{
              width: "22rem",
              height: "22rem",
              left: "-6rem",
              top: "2rem",
              background:
                "radial-gradient(circle,var(--harbor-soft) 0%,transparent 70%)",
              opacity: 0.5,
            }}
          />
          <div
            className="blob blob-soft"
            style={{
              width: "16rem",
              height: "16rem",
              right: "-4rem",
              bottom: 0,
              background:
                "radial-gradient(circle,var(--marigold-soft) 0%,transparent 70%)",
              opacity: 0.4,
            }}
          />
        </div>
        <SectionHeading
          eyebrow="Program Overview"
          title={data.overview.title}
          index="01"
        />
        <p
          style={{
            maxWidth: "58ch",
            fontSize: ".95rem",
            lineHeight: 1.75,
            color: "#4a4638",
            position: "relative",
            zIndex: 2,
          }}
        >
          {data.overview.body}
        </p>
        <div className="pillars">
          {data.overview.pillars.map((pillar, index) => (
            <PillarCard key={pillar.title} pillar={pillar} index={index} />
          ))}
        </div>
      </RevealSection>

      <RevealSection id="timeline" className="timeline-sec">
        <div ref={timelineRef} className="timeline-anchor" />
        <div className="blob-field">
          <div
            className="blob blob-soft"
            style={{
              width: "26rem",
              height: "26rem",
              left: "40%",
              top: "-8rem",
              background:
                "radial-gradient(circle,var(--marigold-soft) 0%,transparent 70%)",
              opacity: 0.35,
            }}
          />
        </div>
        <div className="wrap">
          <SectionHeading
            eyebrow="Seven-Day Itinerary"
            title={["Day by Day"]}
            index="02"
          >
            <p className="timeline-note">{data.itineraryNote}</p>
          </SectionHeading>
          <div
            className="ticket-track"
            role="tablist"
            aria-label={`Week ${data.weekNumber} days`}
          >
            {data.days.map((item, index) => (
              <div className="ticket-stack" key={item.n}>
                <button
                  className={`ticket${selectedDay === index ? " active stamped" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={selectedDay === index}
                  onClick={() => setSelectedDay(index)}
                >
                  <span className="day-tag">{item.tag}</span>
                  <span className="day-num">{item.n}</span>
                  <span className="day-date">{item.date}</span>
                  <span className="day-hl">{item.hl}</span>
                </button>
              </div>
            ))}
          </div>
          <div className="detail-drawer">
            {!day ? (
              <div className="detail-empty">
                ↑ Select a day above to see the highlight
              </div>
            ) : (
              <div className="detail-content show" key={day.n}>
                <div className="detail-split">
                  <div>
                    <div className="detail-top">
                      <div>
                        <span className="detail-daylabel">DAY {day.n}</span>
                        <div className="detail-date">{day.date}</div>
                      </div>
                    </div>
                    <h3 className="detail-title">{day.title}</h3>
                    <p className="detail-body">{day.body}</p>
                    <div className="badge-row">
                      {day.badges.map((badge, index) => (
                        <span
                          key={badge}
                          className={`badge${index === 0 ? " alt" : ""}`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <PhotoTile
                    image={{ src: day.img, alt: day.title, label: day.tag }}
                    className="detail-ph"
                  />
                </div>
              </div>
            )}
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
            eyebrow="Who You'll Meet · Click to Flip"
            title={["The Company Wall"]}
            index="03"
          />
          <div className="stampwall">
            {data.companies.map((company) => (
              <CompanyCard key={company.name} company={company} wide />
            ))}
          </div>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...data.marquee, ...data.marquee].map((name, index) => (
                <span className="marquee-item" key={`${name}-${index}`}>
                  <span className="dot" />
                  {name}
                </span>
              ))}
            </div>
          </div>
          <p className="marquee-hint">
            ↑ Hover to see the rest of the week&apos;s visits scroll by
          </p>
          {data.companyNote ? (
            <p className="company-note">{data.companyNote}</p>
          ) : null}
        </div>
      </RevealSection>

      <RevealSection className="sec gain-sec">
        <div className="wrap">
          <SectionHeading
            eyebrow="What You Will Gain"
            title={data.gain.title}
            index="04"
          />
          <div className="gain-grid">
            <div className="gain-lead-col">
              <p className="gain-lead">
                <TextSegments segments={data.gain.lead} />
              </p>
              <PhotoTile image={data.gain.image} className="gain-ph" />
            </div>
            <div className="gain-list">
              {data.gain.items.map((item, index) => (
                <div className="gain-item" key={item.title}>
                  <span className="gn">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h5>{item.title}</h5>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chip-row">
            {data.gain.chips.map((chip) => (
              <button
                className={`chip${pulsingChip === chip ? " pulse" : ""}`}
                type="button"
                key={chip}
                onAnimationEnd={() => setPulsingChip(null)}
                onClick={() => chooseFromChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <p className="chip-hint">
            Tap a tag to jump to a matching day in the itinerary ↑
          </p>
        </div>
      </RevealSection>

      <RevealSection id="guests" className="guest-sec">
        <div className="blob-field">
          <div
            className="blob blob-soft"
            style={{
              width: "20rem",
              height: "20rem",
              left: "-4rem",
              bottom: "-6rem",
              background:
                "radial-gradient(circle,var(--marigold-soft) 0%,transparent 70%)",
              opacity: 0.35,
            }}
          />
        </div>
        <div className="wrap">
          <SectionHeading
            eyebrow="Featured Guests · Click to Flip"
            title={["Voices From", "the Week"]}
            index="05"
          />
          <div className="guest-grid">
            {data.guests.map((guest) => (
              <GuestCard key={guest.name} guest={guest} />
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection id="pricing" className="price-sec">
        <div className="blob-field">
          <div
            className="blob blob-soft"
            style={{
              width: "22rem",
              height: "22rem",
              left: "-4rem",
              top: "-6rem",
              background:
                "radial-gradient(circle,var(--marigold) 0%,transparent 70%)",
              opacity: 0.22,
            }}
          />
        </div>
        <div className="wrap">
          <SectionHeading
            eyebrow="Pricing & Application"
            title={["Two Ways to", `Join Week ${data.weekNumber}`]}
            index="06"
          />
          <PriceCards weekNumber={data.weekNumber} />
        </div>
      </RevealSection>

      <RevealSection id="logistics" className="logi-sec">
        <div className="wrap">
          <SectionHeading
            eyebrow="Logistics"
            title={["Arrival to", "Departure"]}
            index="07"
          />
          <div className="logi-grid">
            {data.logistics.map((item) => (
              <div className="logi-block" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
                <PhotoTile image={item.image} className="logi-ph" />
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <footer>
        <div className="wrap">
          <p className="foot-tag">A bridge is worth what crosses it.</p>
          {data.footerRows.map((row, index) => (
            <div
              className="foot-links"
              data-secondary={index > 0 ? "true" : undefined}
              key={index}
            >
              {row.map((item) => (
                <FooterLink key={item.text} href={item.href}>
                  {item.text}
                </FooterLink>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}
