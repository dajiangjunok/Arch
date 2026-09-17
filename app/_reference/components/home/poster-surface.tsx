"use client";

import type { ReactNode } from "react";

export function PosterSurface({ children }: { children: ReactNode }) {
  return (
    <section
      id="top"
      className="ph-hero"
      data-ph-hero
      onPointerMove={(event) => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
          return;
        }
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--poster-x", String((event.clientX - bounds.left) / bounds.width - 0.5));
        event.currentTarget.style.setProperty("--poster-y", String((event.clientY - bounds.top) / bounds.height - 0.5));
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.removeProperty("--poster-x");
        event.currentTarget.style.removeProperty("--poster-y");
      }}
    >
      {children}
    </section>
  );
}
