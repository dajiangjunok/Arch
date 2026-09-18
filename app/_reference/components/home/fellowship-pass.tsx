"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getTicket } from "@/lib/tickets";
import { fellowshipBenefits, fellowshipStays } from "../../data/home-page";
import styles from "../../home-page.module.css";

export function FellowshipPass() {
  const [selectedWeeks, setSelectedWeeks] = useState<number>(1);
  const [flipped, setFlipped] = useState(false);
  const frontButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const previousFlipped = useRef(false);
  const stay = fellowshipStays.find((option) => option.weeks === selectedWeeks)!;
  const ticket = getTicket(stay.ticketId);

  useEffect(() => {
    if (previousFlipped.current === flipped) return;
    previousFlipped.current = flipped;
    const button = flipped ? backButtonRef.current : frontButtonRef.current;
    button?.focus({ preventScroll: true });
  }, [flipped]);

  return (
    <>
      <div className={styles.staySelector} role="group" aria-label="Choose your stay">
        <div className={styles.stayOptions}>
          {fellowshipStays.map((option) => (
            <button
              key={option.weeks}
              type="button"
              className={styles.stayOption}
              aria-pressed={selectedWeeks === option.weeks}
              onClick={() => setSelectedWeeks(option.weeks)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className={styles.stayNote} aria-live="polite" aria-atomic="true">
          <span>{stay.note}</span>
          {stay.saving ? <span className={styles.staySaving}>{stay.saving}</span> : null}
        </p>
      </div>
      <div className={`builder-pass${flipped ? " flipped" : ""}`}>
        <div className="builder-pass-inner">
          <button
            ref={frontButtonRef}
            type="button"
            className="builder-pass-face builder-pass-front"
            aria-label="Reveal The Arch Roamer fellowship benefits"
            aria-expanded={flipped}
            aria-hidden={flipped}
            inert={flipped}
            onClick={() => setFlipped(true)}
          >
            <span className="bp-mark" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2 14.5 9 22 9.5 16 14 18 21.5 12 17.5 6 21.5 8 14 2 9.5 9.5 9Z" />
              </svg>
            </span>
            <span className="bp-badge">The Arch Roamer</span>
            <span className="bp-sub">Priority Seat · Apply to Reveal</span>
            <span className="bp-hint">Tap ↻</span>
          </button>
          <div className="builder-pass-face builder-pass-back" aria-hidden={!flipped} inert={!flipped}>
            <div>
              <div className={styles.passHeading}>
                <p className="incl-heading">Included</p>
                <button
                  ref={backButtonRef}
                  type="button"
                  className={styles.passBack}
                  aria-label="Show fellowship pass front"
                  onClick={() => setFlipped(false)}
                >
                  ↶
                </button>
              </div>
              <ul className="incl-mini">
                {fellowshipBenefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
              </ul>
            </div>
            <Link className="bp-apply" href={`/apply?pass=${ticket.id}`}>
              Apply for Fellowship →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
