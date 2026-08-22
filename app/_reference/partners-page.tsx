"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RevealSection } from "./components/interactive";

const contactAddress = "globalpropellerarch@gmail.com";

const stages = [
  {
    id: "enterprise",
    exhibit: "Exhibit No. 00",
    label: "Enterprise",
    tag: "For those who've already gone far, still looking for bigger coordinates",
    title: "Let the world see you more accurately.",
    body: "Companies that have already reached scale carry years of accumulated technology, team, and industry experience. The Arch creates a more direct setting for exchange — bringing founders, investors, and decision-makers from different countries into the room to talk technology, product, and the future of the industry with your team.",
    stats: [
      {
        value: "32.7%",
        label:
          "YoY growth in Kuaishou's overseas revenue, Q1 2025 — the quarter it first turned an operating profit abroad",
      },
      {
        value: "236M",
        label:
          "Users served by MiniMax's products across 200+ countries and regions",
      },
    ],
    subject: "Enterprise Partnership Inquiry",
    image: "/reference/00c0d7c89042117f.jpg",
    imageAlt: "Visitors in conversation on-site",
  },
  {
    id: "growth",
    exhibit: "Invitation · No.07",
    label: "Growth-Stage",
    tag: "For those who've already gone from 0 to 1, and are looking for the next stretch of growth",
    title: "On the other side of the map, who actually needs your product?",
    body: "The product works. Customers believe in it. The team has found its footing. The next stretch of growth may come from overseas — but \"overseas\" is really many different customers, industries, and business environments at once. The Arch is looking for growth-stage companies with proven products exploring international expansion, and bringing founders, decision-makers, investors, and industry partners from around the world to meet your team around the real product.",
    stats: [
      {
        value: "100M+",
        label:
          "Global downloads of Glority's PictureThis plant ID app, across 190+ countries",
      },
      {
        value: "96.62%",
        label:
          "Share of Anker Innovations' 2025 revenue (RMB 30.5B) that came from overseas",
      },
    ],
    subject: "Growth-Stage Partnership Inquiry",
    image: "/reference/5eb627eee0a97408.jpg",
    imageAlt: "Industrial park on-site",
  },
  {
    id: "startup",
    exhibit: "Boarding Pass · No.08",
    label: "Startup",
    tag: "For those the world hasn't seen yet, but who've already started building",
    title: "A small team can reach the world before the company does.",
    body: "One a.m., and the group chat is still pushing the latest demo build. The founder is doing product, sales, and support at the same time — a team of a few people, often doing the work of an entire company. The Arch wants to bring early AI software and hardware teams to the table with whatever's actually happening right now: a demo you can already try, a hardware prototype still being iterated on, a capability that just came together.",
    stats: [
      {
        value: "2M",
        label: "Global waitlist Manus built during its invite-only phase",
      },
      {
        value: "$36M",
        label:
          "Annual recurring revenue Genspark's Super Agent reached 45 days after launch",
      },
    ],
    subject: "Startup Application",
    image: "/reference/83e22e797342cb1b.jpg",
    imageAlt: "YOUNG installation on-site",
  },
] as const;

const benefits = [
  {
    number: "One",
    title: "In the Room",
    body: "Direct access to the founders, investors, and operators in each week's cohort. Not a booth people walk past — a seat at the table.",
  },
  {
    number: "Two",
    title: "Shape a Session",
    body: "Host a workshop, a company visit, or a conversation as part of the week's actual programming, not a side event competing for attention.",
  },
  {
    number: "Three",
    title: "Beyond the Week",
    body: "The cohort keeps building after the program ends. A good partnership reaches into that network long after November.",
  },
] as const;

const partnerLogos = [
  { src: "/reference/288e0c898a6fca8c.png", alt: "Kimi logo" },
  { src: "/reference/63c48b3c26c12d69.png", alt: "MiniMax logo" },
  { src: "/reference/9c6e48d1477c144c.png", alt: "VolcanoEngine logo" },
  { src: "/reference/2affb9528f749d5d.png", alt: "Fourier logo" },
  { src: "/reference/50c8e7747ef42a47.png", alt: "AGIBOT logo" },
  { src: "/reference/16e9af4852ce2f3a.png", alt: "Alibaba logo" },
  { src: "/reference/bc66b1405b54eb1d.png", alt: "ByteDance logo" },
] as const;

function emailLink(subject: string, address = contactAddress) {
  return `mailto:${address}?subject=${encodeURIComponent(`The Arch. — ${subject}`)}`;
}

function BridgeStage() {
  const [controlX, setControlX] = useState(150);

  return (
    <div
      className="bridge-stage-v"
      onPointerMove={(event) => {
        if (!window.matchMedia("(hover: hover)").matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const relativeX = (event.clientX - bounds.left) / bounds.width;
        setControlX(Math.max(10, Math.min(290, 150 + (relativeX - 0.5) * 260)));
      }}
      onPointerLeave={() => setControlX(150)}
    >
      <svg
        className="bridge-svg-v"
        viewBox="0 0 300 480"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={`M40,40 Q${controlX},240 260,440`} />
      </svg>
      <div className="bridge-node-v bridge-node-top">
        <span className="bridge-node-dot" />
        <span className="bridge-node-label">Your Brand</span>
      </div>
      <div className="bridge-node-v bridge-node-bottom">
        <span className="bridge-node-dot" />
        <span className="bridge-node-label">The Builders</span>
      </div>
      <span className="bridge-hint-v">
        move your cursor
        <br />
        the bridge follows
      </span>
    </div>
  );
}

export function PartnersPage() {
  const [selectedStage, setSelectedStage] = useState(0);
  const stage = stages[selectedStage];

  return (
    <>
      <section id="top" className="partner-hero wrap">
        <div className="partner-hero-grid">
          <div className="partner-hero-copy">
            <p className="sec-eyebrow">Partnerships · 2026</p>
            <h1 className="partner-headline">
              Your brand, on the ground with the <em>builders</em>.
            </h1>
            <p className="partner-sub">
              Each week, The Arch brings 20–30 founders, investors, and
              operators into China&apos;s AI and hardware ecosystem. Partnering
              means being in that room — not sponsoring a logo wall they walk
              past.
            </p>
            <div className="partner-cta">
              <a
                className="btn btn-fill"
                href={emailLink("Partnership Inquiry", "business@globalpropeller.com")}
              >
                Become a Partner →
              </a>
            </div>
          </div>
          <BridgeStage />
        </div>
      </section>

      <RevealSection className="section wrap" id="stages">
        <div className="sec-head">
          <div>
            <span className="sec-eyebrow">Built For Every Stage</span>
            <h2 className="sec-title">Which One Are You?</h2>
          </div>
        </div>
        <div className="stage-tabs" role="tablist" aria-label="Partner stages">
          {stages.map((item, index) => (
            <button
              key={item.id}
              className={`stage-tab${selectedStage === index ? " active" : ""}`}
              type="button"
              role="tab"
              aria-selected={selectedStage === index}
              aria-controls="partner-stage-panel"
              onClick={() => setSelectedStage(index)}
            >
              <span>{item.exhibit}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
        <div className="stage-panel active" id="partner-stage-panel" role="tabpanel">
          <div className="stage-grid" key={stage.id}>
            <div className="stage-copy">
              <span className="stage-tag">{stage.tag}</span>
              <h3 className="stage-h3">{stage.title}</h3>
              <p className="stage-body">{stage.body}</p>
              <div className="stage-stats">
                {stage.stats.map((stat) => (
                  <div className="stage-stat" key={stat.value}>
                    <b>{stat.value}</b>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="stage-cta">
                <a className="btn btn-fill" href={emailLink(stage.subject)}>
                  Get in Touch →
                </a>
              </div>
            </div>
            <div className="stage-media">
              <Image src={stage.image} alt={stage.imageAlt} fill sizes="(min-width: 900px) 42vw, 100vw" />
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="section wrap" id="why">
        <div className="sec-head">
          <div>
            <span className="sec-eyebrow">Why Partner</span>
            <h2 className="sec-title">
              Not a Logo Wall.
              <br />A Seat at the Table.
            </h2>
          </div>
        </div>
        <div className="why-grid">
          {benefits.map((benefit) => (
            <article className="why-card tick-corner" key={benefit.number}>
              <span className="why-num">{benefit.number}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="section wrap" id="partner-wall">
        <div className="sec-head">
          <div>
            <span className="sec-eyebrow">Who&apos;s In</span>
            <h2 className="sec-title">The Partner Wall</h2>
          </div>
        </div>
        <div className="partner-wall-grid">
          {partnerLogos.map((logo) => (
            <div className="partner-logo" key={logo.alt}>
              <Image src={logo.src} alt={logo.alt} fill sizes="180px" />
            </div>
          ))}
        </div>
        <p className="partner-wall-note">
          A few of the companies you&apos;ll meet on the program — confirmed
          brand partners will join this wall soon.
        </p>
      </RevealSection>

      <RevealSection className="section wrap contact-section" id="contact">
        <p className="sec-eyebrow">Get In Touch</p>
        <h2 className="sec-title">
          Interested in
          <br />Partnering?
        </h2>
        <p className="contact-sub">
          Tell us about your brand and what you&apos;re looking for. We&apos;ll
          follow up with the right fit for this cohort.
        </p>
        <div className="contact-cta">
          <a
            className="btn btn-fill"
            href={emailLink("Partnership Inquiry", "business@globalpropeller.com")}
          >
            Get in Touch →
          </a>
        </div>
      </RevealSection>

      <footer>
        <div className="wrap">
          <p className="foot-tag">A bridge is worth what crosses it.</p>
          <div className="foot-links">
            <Link href="/">← Full three-week program</Link>
            <a href="mailto:business@globalpropeller.com">
              business@globalpropeller.com
            </a>
            <Link href="/">Back to home →</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
