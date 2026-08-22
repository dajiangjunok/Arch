"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CompanyData, PillarData } from "../types";
import { ArchImage, PillarIcon, rotationStyle } from "./shared";

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const maximum =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (progressRef.current)
        progressRef.current.style.width = `${maximum > 0 ? (window.scrollY / maximum) * 100 : 0}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
  );
}

export function RevealSection({
  id,
  className,
  children,
}: {
  id?: string;
  className: string;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(section);
    const fallback = window.setTimeout(() => setVisible(true), 1200);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${className} reveal${visible ? " in" : ""}`}
    >
      {children}
    </section>
  );
}

export function HeroSurface({
  children,
  background,
}: {
  children: ReactNode;
  background?: ReactNode;
}) {
  const blobRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="hero-main tick-corner"
      onPointerMove={(event) => {
        if (!blobRef.current || !window.matchMedia("(hover: hover)").matches)
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        blobRef.current.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      }}
      onPointerLeave={() => {
        if (blobRef.current)
          blobRef.current.style.transform = "translate(0, 0)";
      }}
    >
      <div ref={blobRef} id="heroBlob" />
      <div className="blob2" />
      {background}
      {children}
    </div>
  );
}

export function DossierLink() {
  return (
    <button
      className="btn btn-line btn-dossier"
      type="button"
      onClick={() => window.alert("占位链接 — 请替换为真实 Dossier PDF 地址")}
    >
      ↓ Full Dossier (PDF)
      <span className="tag">占位</span>
    </button>
  );
}

export function PillarCard({
  pillar,
  index,
}: {
  pillar: PillarData;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      className={`pillar p${index + 1}${open ? " open" : ""}`}
      type="button"
      aria-expanded={open}
      onClick={() => setOpen((current) => !current)}
    >
      <div className="pillar-ghost">
        <ArchImage src={pillar.image} alt="" />
      </div>
      <div className="pillar-top">
        <div className="pillar-badge">{pillar.number}</div>
        <PillarIcon name={pillar.icon} />
      </div>
      <div>
        <h4>{pillar.title}</h4>
        <p>{pillar.body}</p>
      </div>
      <div className="pillar-extra">
        <p>{pillar.insight}</p>
      </div>
      <span className="pillar-toggle">{open ? "− Close" : "+ Insight"}</span>
    </button>
  );
}

function useFlip() {
  const [flipped, setFlipped] = useState(false);
  return {
    flipped,
    interaction: {
      role: "button" as const,
      tabIndex: 0,
      "aria-pressed": flipped,
      onClick: () => setFlipped((current) => !current),
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setFlipped((current) => !current);
        }
      },
    },
  };
}

export function CompanyCard({
  company,
  wide = false,
}: {
  company: CompanyData;
  wide?: boolean;
}) {
  const { flipped, interaction } = useFlip();
  return (
    <div
      className={`flip-card${flipped ? " flipped" : ""}`}
      style={rotationStyle(company.rotation)}
      {...interaction}
    >
      <div className="flip-inner">
        <div className="flip-face">
          <div
            className={`logo-slot${wide ? " logo-slot-wide" : ""}${company.darkLogo ? " logo-slot-dark" : ""}`}
          >
            <ArchImage src={company.image} alt={company.imageAlt} />
          </div>
          {company.initials ? (
            <span className="init">{company.initials}</span>
          ) : null}
          <span className="cname">{company.name}</span>
          <span className="flip-hint">Tap ↻</span>
        </div>
        <div className="flip-face flip-back">
          <p>{company.description}</p>
        </div>
      </div>
    </div>
  );
}

export function FooterLink({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  if (!href) return <span>{children}</span>;
  if (href.startsWith("mailto:")) return <a href={href}>{children}</a>;
  return <Link href={href}>{children}</Link>;
}
