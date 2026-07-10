export function SectionHeading({
  eyebrow,
  title,
  exhibit,
  copy,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  exhibit: string;
  copy?: string;
  centered?: boolean;
}) {
  return (
    <div className={`section-head reveal ${centered ? "items-center text-center" : ""}`}>
      <div className={centered ? "mx-auto" : ""}>
        <span className="arch-eyebrow">{eyebrow}</span>
        <h2 className="arch-title mt-4 max-w-[14ch]">{title}</h2>
        <span className={`title-rule ${centered ? "mx-auto" : ""}`} />
        {copy ? <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/70">{copy}</p> : null}
      </div>
      {!centered ? <span className="arch-exhibit">{exhibit}</span> : null}
    </div>
  );
}
