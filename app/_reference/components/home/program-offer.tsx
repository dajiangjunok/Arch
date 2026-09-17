import Link from "next/link";
import { ArchImage, SectionHeading } from "../shared";
import { RevealSection } from "../interactive";
import { excludedExpenses, travelNotes } from "../../data/home-page";
import styles from "../../home-page.module.css";

export function ProgramOffer() {
  return (
    <RevealSection id="included" className="incl-sec">
      <div className="wrap">
        <SectionHeading eyebrow="The Offer" title={["What's Not", "Covered"]} />
        <div className="incl-grid">
          <div className="incl-price-col incl-price-col-photo">
            <ArchImage
              src="/reference/45609c5450c39032.jpg"
              alt="Fuxing Island, Shanghai"
              sizes="(min-width: 1240px) 486px, (min-width: 860px) 42vw, 100vw"
            />
            <div className="incl-price-photo-overlay">
              <span className="incl-price-photo-tag">Fuxing Island · Shanghai</span>
              <div className="incl-price-cta">
                <Link className="btn btn-fill" href="/apply?pass=single_week">
                  Apply to Participate →
                </Link>
              </div>
            </div>
          </div>
          <div className="incl-list-col">
            <p className={styles.offerIntro}>
              We keep the program tight and cover everything inside it. What’s
              outside is yours to shape.
            </p>
            <h3 className="incl-list-heading">Not Included</h3>
            <ul className="not-incl-list">
              {excludedExpenses.map((expense) => <li key={expense}>{expense}</li>)}
            </ul>
            <div className={styles.travelNotes}>
              <h3 className={styles.travelNotesHeading}>Good to Know</h3>
              <ul className={styles.travelNotesList}>
                {travelNotes.map((note) => (
                  <li key={note.title}>
                    <span><b>{note.title}</b> — {note.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
