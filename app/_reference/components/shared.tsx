"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useState, type CSSProperties, type ReactNode } from "react";
import type { ImageData, PillarIconName, TextSegment } from "../types";

export type RotationStyle = CSSProperties & { "--r": string };

export function rotationStyle(rotation: string): RotationStyle {
  return { "--r": rotation };
}

export function ArchImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 800px) 100vw, 33vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />;
}

export function PhotoTile({
  image,
  className,
}: {
  image: ImageData;
  className: string;
}) {
  return (
    <div
      className={`img-placeholder has-photo ${className}`}
      style={image.rotation ? rotationStyle(image.rotation) : undefined}
    >
      <ArchImage src={image.src} alt={image.alt} />
      {image.label ? (
        <span className="ip-label ip-label-photo">{image.label}</span>
      ) : null}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  index,
  children,
}: {
  eyebrow: string;
  title: readonly string[];
  index?: string;
  children?: ReactNode;
}) {
  return (
    <div className="sec-head">
      <div>
        <span className="sec-eyebrow">{eyebrow}</span>
        <h2 className="sec-title">
          {title.map((line, indexOfLine) => (
            <span key={line}>
              {indexOfLine > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h2>
        {children}
      </div>
      {index ? <span className="sec-idx">{index}</span> : null}
    </div>
  );
}

export function TextSegments({
  segments,
}: {
  segments: readonly TextSegment[];
}) {
  return segments.map((segment, index) => (
    <Fragment key={index}>
      {index > 0 ? " " : null}
      {segment.emphasis ? <em>{segment.text}</em> : <span>{segment.text}</span>}
    </Fragment>
  ));
}

export function CornerStamp() {
  return (
    <span className="corner-stamp" aria-hidden="true">
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <circle cx="12" cy="12" r="9" strokeDasharray="2 3" />
      </svg>
    </span>
  );
}

export function PillarIcon({ name }: { name: PillarIconName }) {
  const paths: Record<PillarIconName, ReactNode> = {
    chat: (
      <>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        <path d="M8 10h8M8 13h5" />
      </>
    ),
    model: (
      <>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      </>
    ),
    session: (
      <path d="M17 20.5 12 18l-5 2.5V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2Z" />
    ),
    humanoid: (
      <>
        <circle cx="12" cy="7" r="3.2" />
        <path d="M6 21v-3a6 6 0 0 1 12 0v3" />
      </>
    ),
    hardware: (
      <>
        <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
        <path d="M4 12h2m12 0h2M12 4v2m0 12v2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4M6.3 17.7l1.4-1.4m8.6-8.6 1.4-1.4" />
      </>
    ),
    factory: <path d="M3 21V9l6 4V9l6 4V9l6 4v8H3Z" />,
    product: (
      <>
        <path d="M21 8 12 3 3 8v8l9 5 9-5Z" />
        <path d="m3 8 9 5 9-5M12 13v8" />
      </>
    ),
    wearable: (
      <>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2.4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </>
    ),
    market: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l3-3 3 3 5-6" />
      </>
    ),
  };

  return (
    <svg
      className="pillar-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function PriceCards({ weekNumber }: { weekNumber?: number }) {
  const singleTitle = weekNumber
    ? `Week ${weekNumber} Only`
    : "Choose Week 1, 2, or 3";
  const singleCta = weekNumber ? `Apply for Week ${weekNumber} →` : "Apply →";
  const singleHref = weekNumber
    ? `/apply?pass=single_week&week=week_${weekNumber}`
    : "/apply?pass=single_week";

  const [passFlipped, setPassFlipped] = useState(false);
  const singleDescription =
    weekNumber === 2
      ? "Six days inside the rooms most people only read about afterward."
      : "Seven days inside the rooms most people only read about afterward.";

  return (
    <div className="price-grid">
      <div className="price-card single tick-corner">
        <CornerStamp />
        <p className="kicker">Single Week</p>
        <h3>{singleTitle}</h3>
        <p className="card-hook">{singleDescription}</p>
        <div className="for-row">
          <span className="for-label">For</span>
          <span className="for-tag">Founders</span>
          <span className="for-tag">Investors</span>
          <span className="for-tag">Executives</span>
          <span className="for-tag">Institutions</span>
        </div>
        <div className="incl-block">
          <p className="incl-heading">Included</p>
          <ul className="incl-mini">
            <li>Full access to the week&apos;s company, factory &amp; lab visits</li>
            <li>
              Closed-door founder &amp; investor sessions, plus B2B meetings
            </li>
            <li>Accommodation, with breakfast, lunch &amp; dinner covered</li>
            <li>
              All in-China transport, including domestic flights &amp;
              interpretation
            </li>
            <li>A team with you throughout</li>
          </ul>
        </div>
        <div className="fee-stack">
          <div className="fee-row fee-row-active">
            <span className="lbl">
              Early Adopter <span className="fee-badge">Open Now</span>
            </span>
            <span className="fee">$9,799</span>
          </div>
          <div className="fee-row fee-row-muted">
            <span className="lbl">
              Regular <span className="fee-sub-note">from Oct 15</span>
            </span>
            <span className="fee fee-sm">$12,900</span>
          </div>
        </div>
        <Link className="btn" href={singleHref}>
          {singleCta}
        </Link>
      </div>
      <div className="price-card fellow tick-corner">
        <CornerStamp />
        <p className="kicker">Limited · Fellowship Program</p>
        <h3>Fellowship Pass</h3>
        <p className="card-hook">
          Most of the room pays their way, and that&apos;s what keeps The Arch
          independent and sustainable. Every cohort, The Arch holds a handful of seats for
          builders who don&apos;t have funding yet, don&apos;t have a travel budget,
          and have nothing to show the world but the thing they&apos;re actually
          building. Apply below, and see the <Link href="/faq">FAQ</Link> for
          how it works.
        </p>
        <div className="for-row">
          <span className="for-label">For</span>
          <span className="for-tag">Builders</span>
          <span className="for-tag">Makers</span>
          <span className="for-tag">Pre-Funding</span>
        </div>
        <div
          className={`builder-pass${passFlipped ? " flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={passFlipped}
          onClick={() => setPassFlipped((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setPassFlipped((current) => !current);
            }
          }}
        >
          <div className="builder-pass-inner">
            <div className="builder-pass-face builder-pass-front">
              <div className="bp-mark" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2 14.5 9 22 9.5 16 14 18 21.5 12 17.5 6 21.5 8 14 2 9.5 9.5 9Z" />
                </svg>
              </div>
              <p className="bp-badge">Fellowship</p>
              <p className="bp-sub">Priority Seat · Apply to Reveal</p>
              <p className="bp-hint">Tap ↻</p>
            </div>
            <div className="builder-pass-face builder-pass-back">
              <div>
                <p className="incl-heading">Included</p>
                <ul className="incl-mini">
                  <li>Housing on Fuxing Island</li>
                  <li>Partial access to the week&apos;s company visits</li>
                  <li>Shared workspace on Fuxing Island to build</li>
                </ul>
                <p className="incl-heading bp-not-included">Not Included</p>
                <ul className="not-incl-mini">
                  <li>Meals</li>
                </ul>
              </div>
              <Link
                className="bp-apply"
                href="/apply?pass=full_program"
                onClick={(event) => event.stopPropagation()}
              >
                Apply for Fellowship →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
