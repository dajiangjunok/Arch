export function VisaFaqAnswer() {
  return (
    <div className="arch-visa-answer">
      <section className="arch-visa-answer__panel arch-visa-answer__panel--wide">
        <h4>US passport holders</h4>
        <span className="arch-visa-answer__tag arch-visa-answer__tag--amber">
          Depends on length of stay
        </span>
        <p>
          The US is not on the visa-free list. A short stay may be covered by
          the 240-hour visa-free transit route, though conditions apply and the
          three-week Fellowship runs past its limit. Check the current policy
          before booking.
        </p>
      </section>

      <div className="arch-visa-answer__row">
        <section className="arch-visa-answer__panel">
          <h4>
            Most of Europe, UK, Canada, Japan, South Korea, Australia, New
            Zealand
          </h4>
          <span className="arch-visa-answer__tag arch-visa-answer__tag--green">
            Likely visa-free
          </span>
          <p>
            Around 50 countries currently have 30-day visa-free entry, which
            covers business travel and is long enough for the full three weeks.
            The UK and Canada were added in February 2026.
          </p>
        </section>

        <section className="arch-visa-answer__panel">
          <h4>All other nationalities</h4>
          <span className="arch-visa-answer__tag arch-visa-answer__tag--blue">
            Visa likely required
          </span>
          <p>
            Apply at your local consulate. Some nationalities also qualify for
            the transit route above.
          </p>
        </section>
      </div>

      <aside className="arch-visa-answer__note">
        <h4>Before you book</h4>
        <p>
          The above is general reference only, not immigration advice.
          China&apos;s visa rules have changed several times in recent years and
          can change again before November. We do not handle visa applications
          and cannot be responsible for entry decisions. Confirm your own
          requirements at{" "}
          <a
            href="https://www.visaforchina.cn"
            target="_blank"
            rel="noopener noreferrer"
          >
            visaforchina.cn
          </a>{" "}
          or with your nearest Chinese consulate before booking flights.
        </p>
        <p>
          We issue an invitation letter on request once your registration is
          confirmed. The application itself is yours to handle.
        </p>
      </aside>
    </div>
  );
}
