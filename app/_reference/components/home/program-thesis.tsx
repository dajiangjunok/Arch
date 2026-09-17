import { RevealSection } from "../interactive";

export function ProgramThesis() {
  return (
    <RevealSection id="thesis" className="thesis-sec">
      <div className="blob-field">
        <div className="blob blob-soft thesis-blob" />
      </div>
      <div className="wrap">
        <div className="thesis-wrap">
          <span className="sec-eyebrow thesis-eyebrow">The Thesis</span>
          <h2 className="thesis-title">
            Not a tour.
            <br />A <span className="underline">working bridge</span>.
          </h2>
          <p className="thesis-body">
            A tour walks you past the glass and hands you a stack of photos.
            We take the glass away and put you across the table from the
            people building this technology. What crosses this bridge is what
            counts: contracts, hires, partnerships. Whatever crosses, we
            publish.
          </p>
          <ul className="thesis-tags">
            {[
              "Founder Access",
              "Capital Network",
              "Market Bridge",
              "Hardware Route",
            ].map((tag) => (
              <li className="thesis-tag" key={tag}>
                <span className="label">{tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RevealSection>
  );
}
