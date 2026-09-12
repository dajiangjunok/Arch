import Link from "next/link";
import styles from "./site-footer.module.css";

type FooterItem = {
  label: string;
  href?: string;
  external?: boolean;
  arrow?: boolean;
};

const navigation: readonly { title: string; items: readonly FooterItem[] }[] = [
  {
    title: "Program",
    items: [
      { label: "Week 1", href: "/week1" },
      { label: "Week 2", href: "/week2" },
      { label: "Week 3", href: "/week3" },
      { label: "Single-Week Access", href: "/apply?pass=single_week" },
      { label: "Fellowship", href: "/apply?pass=fellowship" },
    ],
  },
  {
    title: "Navigate",
    items: [
      { label: "About Us" },
      { label: "Partners", href: "/partners" },
      { label: "FAQ", href: "/faq" },
      { label: "Apply", href: "/apply" },
      { label: "Sign in", href: "/login", arrow: true },
    ],
  },
  {
    title: "Contact",
    items: [
      {
        label: "business@globalpropeller.com",
        href: "mailto:business@globalpropeller.com",
      },
      {
        label: "X",
        href: "https://x.com/TheArchGlobal",
        external: true,
        arrow: true,
      },
    ],
  },
];

function FooterLink({ item }: { item: FooterItem }) {
  if (!item.href) {
    return <span className={styles.item}>{item.label}</span>;
  }

  const content = (
    <>
      {item.label}
      {item.arrow ? (
        <span className={styles.arrow} aria-hidden="true">↗</span>
      ) : null}
    </>
  );

  if (item.external || item.href.startsWith("mailto:")) {
    return (
      <a
        className={styles.item}
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return <Link className={styles.item} href={item.href}>{content}</Link>;
}

export function SiteFooter({ separated = false }: { separated?: boolean }) {
  return (
    <footer className={`${styles.footer}${separated ? ` ${styles.separated}` : ""}`}>
      <div className={styles.container}>
        <nav className={styles.navigation} aria-label="Footer">
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink} aria-label="The Arch home">
              <svg className={styles.mark} viewBox="0 0 32 46" aria-hidden="true">
                <path d="M0 46V16a16 16 0 0 1 32 0v30z" fill="currentColor" />
                <path d="M17 46V21.5a5 5 0 0 1 10 0V46z" fill="var(--marigold)" />
              </svg>
              <span className={styles.name}>The Arch.</span>
            </Link>
            <p className={styles.tagline}>
              A bridge is worth<br />what crosses it.
            </p>
          </div>

          {navigation.map((column) => (
            <div className={styles.column} key={column.title}>
              <h3 className={styles.heading}>{column.title}</h3>
              <ul className={styles.list}>
                {column.items.map((item) => (
                  <li key={item.label}><FooterLink item={item} /></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.base}>
          <span>Nov 1 – Nov 21, 2026 · Shanghai, Beijing, Hangzhou &amp; Shenzhen</span>
          <nav className={styles.legal} aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
