"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { RevealSection } from "./components/interactive";
import { VisaFaqAnswer } from "./components/visa-faq-answer";

const categories = [
  { id: "all", label: "All" },
  { id: "app", label: "Application & Pricing" },
  { id: "incl", label: "What's Included" },
  { id: "logi", label: "Logistics" },
  { id: "part", label: "Partners & Fellowship" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

const questions: readonly {
  category: Exclude<CategoryId, "all">;
  question: string;
  answer: ReactNode;
  answerVariant?: "visa";
}[] = [
  {
    category: "app",
    question: "Is this a paid program?",
    answer: (
      <p>
        Yes, <strong>paying a fair price</strong> is what keeps each cohort
        small, access real, and the program accountable to the people in the
        room.
      </p>
    ),
  },
  {
    category: "app",
    question: "How do I apply?",
    answer: (
      <>
        <p>Every seat is reviewed individually — here&apos;s how it works:</p>
        <ol>
          <li>
            Apply via the <strong>&quot;Apply to Participate&quot;</strong>{" "}button
            with a few lines on you, your work, and which week(s) you&apos;re
            applying for.
          </li>
          <li>
            Our team <strong>reviews applications on a rolling basis</strong>,
            followed by a short conversation so we can learn more about you
            and shape the right fit for your week.
          </li>
          <li>
            If accepted, you&apos;ll receive an
            <strong> offer with payment instructions</strong> and a deadline to
            confirm your seat.
          </li>
          <li>
            Once confirmed — <strong>welcome to the cohort.</strong>{" "}We&apos;ll
            follow up with housing, itinerary, and pre-arrival details.
          </li>
        </ol>
      </>
    ),
  },
  {
    category: "app",
    question: "What is the payment policy?",
    answer: (
      <p>
        <strong>Full payment is required</strong> to secure your spot. Your
        place is
        <strong> only confirmed once payment has been received in full</strong>.
      </p>
    ),
  },
  {
    category: "app",
    question: "What is the cancellation / refund policy?",
    answer: (
      <p>
        All payments are <strong>non-refundable</strong>. If you&apos;re unable
        to attend, however, you may
        <strong> transfer your spot to another person</strong>, subject to
        approval by The Arch.
      </p>
    ),
  },
  {
    category: "app",
    question: "Can I attend more than one week?",
    answer: (
      <p>
        Yes — apply to each week individually. Write to us directly for
        <strong> group arrangements</strong>.
      </p>
    ),
  },
  {
    category: "incl",
    question: "What does Single-Week Access include?",
    answer: (
      <ul>
        <li>
          <strong>Full access</strong>{" "}to the week&apos;s company, factory & lab
          visits
        </li>
        <li>
          <strong>Closed-door founder & investor sessions</strong>, plus B2B
          meetings with Chinese companies
        </li>
        <li>Accommodation for the week</li>
        <li>
          <strong>Breakfast, lunch & dinner</strong>, including the
          program&apos;s official dinners
        </li>
        <li>
          All transport within China for the week, including domestic flights
          between cities and airport pickups
        </li>
        <li>Professional interpretation</li>
        <li>A team on the ground with you throughout</li>
      </ul>
    ),
  },
  {
    category: "incl",
    question: "What's not included?",
    answer: (
      <p>
        <strong>International flights</strong>. For visas, we can provide an
        <strong> invitation letter</strong>, but don&apos;t handle the
        application itself. Insurance isn&apos;t included either, though
        we&apos;re happy to share a recommended list.
      </p>
    ),
  },
  {
    category: "incl",
    question: "What does the Fellowship include?",
    answer: (
      <p>
        <strong>Housing on Fuxing Island</strong>, partial access to the
        week&apos;s company visits, and <strong>shared workspace</strong> to
        build.
      </p>
    ),
  },
  {
    category: "logi",
    question: "Where does the program take place?",
    answer: (
      <p>
        Based on <strong>Fuxing Island, Shanghai</strong>. Week 1 is Shanghai
        only; Week 2 adds <strong>Beijing</strong>; Week 3 adds
        <strong> Shenzhen</strong>.
      </p>
    ),
  },
  {
    category: "logi",
    question: "When is it?",
    answer: (
      <p>
        <strong>November 1–21, 2026.</strong>
      </p>
    ),
  },
  {
    category: "logi",
    question: "How big is each cohort?",
    answer: (
      <p>
        <strong>20–30 residents</strong> per week.
      </p>
    ),
  },
  {
    category: "logi",
    question: "Do I need a visa?",
    answer: <VisaFaqAnswer />,
    answerVariant: "visa",
  },
  {
    category: "part",
    question: "Can my company partner with The Arch?",
    answer: (
      <p>
        Yes — see the <strong><Link href="/partners">Partners page</Link></strong>
        {" "}for how to get involved.
      </p>
    ),
  },
  {
    category: "part",
    question: "What is the Fellowship?",
    answer: (
      <p>
        The Fellowship is a small number of places The Arch sets aside each
        cohort for people who are heads-down on something real, before the
        funding has arrived. It works less like a discount and more like a
        <strong> scholarship</strong>{" "}— earned by what you&apos;ve built and
        where it&apos;s headed, not by what you can afford. We look for
        <strong> genuine conviction</strong>, even when the round hasn&apos;t
        closed and the runway is thin. If that&apos;s where you are, apply and
        tell us what you&apos;re building. We&apos;ll
        <strong> reach out personally</strong> to talk it through.
      </p>
    ),
  },
];

export function FaqPage() {
  const [category, setCategory] = useState<CategoryId>("all");
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(
    () => new Set(),
  );
  const visibleQuestions = questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => category === "all" || question.category === category);

  return (
    <>
      <section id="top" className="faq-hero wrap">
        <p className="sec-eyebrow">Frequently Asked Questions · 2026</p>
        <h1 className="faq-headline">
          First time with <em>The Arch</em>? Start here.
        </h1>
        <p className="faq-sub">
          Applications, pricing, what&apos;s included, logistics, and how
          partnerships work. Tap a question to open it.
        </p>
      </section>

      <RevealSection className="section wrap" id="faq">
        <div className="faq-layout">
          <div className="faq-cats" role="tablist" aria-label="FAQ categories">
            {categories.map((item) => (
              <button
                key={item.id}
                className={`faq-cat${category === item.id ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={category === item.id}
                onClick={() => {
                  setCategory(item.id);
                  setOpenQuestions(new Set());
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="faq-list">
            {visibleQuestions.map(({ question, index }) => {
              const open = openQuestions.has(index);
              const answerId = `faq-answer-${index}`;
              return (
                <article
                  className={`faq-item${open ? " open" : ""}${
                    question.answerVariant
                      ? ` faq-item--${question.answerVariant}`
                      : ""
                  }`}
                  key={question.question}
                >
                  <button
                    className="faq-q"
                    type="button"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() =>
                      setOpenQuestions((current) => {
                        const next = new Set(current);
                        if (next.has(index)) next.delete(index);
                        else next.add(index);
                        return next;
                      })
                    }
                  >
                    <span className="faq-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="faq-q-text">{question.question}</span>
                    <span className="faq-icon" aria-hidden="true" />
                  </button>
                  <div className="faq-a-wrap" id={answerId}>
                    <div className="faq-a">{question.answer}</div>
                  </div>
                </article>
              );
            })}
          </div>
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
            <Link href="/partners">Partners →</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
