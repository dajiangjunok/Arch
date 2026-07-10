"use client";

import { useEffect, useRef, useState } from "react";

export function BridgeProgress() {
  const fillRef = useRef<SVGPathElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fill = fillRef.current;
    const walker = walkerRef.current;
    if (!fill || !walker) {
      return;
    }

    const pathLength = fill.getTotalLength();
    fill.style.strokeDasharray = String(pathLength);
    fill.style.strokeDashoffset = String(pathLength);

    let ticking = false;
    let walkTimer: number | undefined;

    function update() {
      if (!fill || !walker) {
        return;
      }

      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const point = fill.getPointAtLength(pathLength * ratio);
      const x = (point.x / 1000) * window.innerWidth;
      const y = window.innerHeight - 52 + point.y;

      fill.style.strokeDashoffset = String(pathLength * (1 - ratio));
      walker.style.transform = `translate(${x - 7}px, ${y - 30}px)`;
      setProgress(Math.round(ratio * 100));

      document.body.classList.add("walking");
      if (walkTimer) {
        window.clearTimeout(walkTimer);
      }
      walkTimer = window.setTimeout(() => document.body.classList.remove("walking"), 140);

      const footer = document.querySelector(".footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        document.body.classList.toggle("footer-zone", rect.top < window.innerHeight - 20);
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (walkTimer) {
        window.clearTimeout(walkTimer);
      }
      document.body.classList.remove("walking", "footer-zone");
    };
  }, []);

  return (
    <>
      <div className="bridge-progress" aria-hidden="true">
        <svg viewBox="0 0 1000 52" preserveAspectRatio="none" className="block h-full w-full">
          <path className="bp-track" d="M 0 50 Q 500 -30 1000 50" fill="none" strokeWidth="1.5" strokeDasharray="3 6" />
          <path ref={fillRef} className="bp-fill" d="M 0 50 Q 500 -30 1000 50" fill="none" strokeWidth="2.5" />
        </svg>
      </div>
      <div ref={walkerRef} className="bp-walker" aria-hidden="true">
        <svg viewBox="0 0 24 48" fill="var(--ink)" className="block h-auto w-full">
          <circle cx="12" cy="6" r="4" />
          <rect x="10" y="11" width="4" height="16" rx="1.5" />
          <rect className="leg-a" x="10" y="24" width="3.5" height="16" rx="1.5" />
          <rect className="leg-b" x="10.5" y="24" width="3.5" height="16" rx="1.5" />
          <rect className="arm-a" x="10" y="13" width="3" height="12" rx="1.5" />
          <rect className="arm-b" x="11" y="13" width="3" height="12" rx="1.5" />
        </svg>
      </div>
      <p className="bp-label" aria-hidden="true">
        Crossing · {progress}%
      </p>
    </>
  );
}
