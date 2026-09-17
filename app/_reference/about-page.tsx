import Image from "next/image";
import { RevealSection } from "./components/interactive";
import styles from "./about-page.module.css";

function AboutHero() {
  return (
    <header className={styles.head}>
      <p className={styles.eyebrow}>The Arch.</p>
      <h1 className={styles.title}>About Us</h1>
      <p className={styles.lede}>
        The bridge where the world crosses into China.
      </p>
      <span className={styles.titleRule} aria-hidden="true" />
    </header>
  );
}

function AboutPhoto({
  src,
  alt,
  caption,
  width,
  height,
  portrait = false,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  portrait?: boolean;
}) {
  return (
    <figure className={`${styles.photo} ${portrait ? styles.portrait : styles.landscape}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={portrait
          ? "(min-width: 1180px) 480px, (min-width: 920px) 45vw, 100vw"
          : "(min-width: 1180px) 582px, (min-width: 920px) 55vw, 100vw"}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function AboutStory() {
  return (
    <RevealSection className={`${styles.bodyGrid} ${styles.reveal}`}>
      <div className={styles.copy}>
        <p>
          The Arch is a three-week China innovation immersion, co-hosted with{" "}
          <strong>PROPELLER</strong>. From November 1 to 21, 2026 we travel
          through Shanghai, Beijing, Hangzhou and Shenzhen, into more than 50
          companies and institutions, in conversation with more than 60 featured
          guests. Most China programs are a tour behind glass: you walk the
          showroom, take a few photographs, leave with a folder. The Arch puts
          you across the table from the people building it, free to ask what you
          actually came to ask.
        </p>
        <p>
          The team behind it has spent five years inside China&apos;s open-source
          and AI ecosystem. We organized the{" "}
          <strong>2023 Open Source Industry Ecosystem Conference</strong>, the{" "}
          <strong>Open Source Bazaar at WAIC</strong> and{" "}
          <strong>Tech PodFest</strong>, and we run an international open-source
          community started by AI builders, close to 100,000 people across
          Chinese platforms, with long-standing ties to Startup Grind and to
          more than 100 open-source communities and 80 incubators and
          accelerators worldwide. That is what lets us bring people inside
          these companies rather than to the door.
        </p>
      </div>
      <AboutPhoto
        src="/about/team-dinner.jpg"
        alt="The Arch team and guests over dinner in Shanghai"
        caption="The team · Shanghai · 2026"
        width={864}
        height={1080}
        portrait
      />
    </RevealSection>
  );
}

function AboutParticipants() {
  return (
    <RevealSection className={`${styles.band} ${styles.reveal}`}>
      <AboutPhoto
        src="/about/participants-campus.jpg"
        alt="International participants at a company campus during the program"
        caption="Participants on the ground · 2026"
        width={1100}
        height={733}
      />
      <div className={styles.bandNote}>
        <h2>Who comes</h2>
        <p>
          Founders, investors and builders from around the world, in the same
          rooms as the people shaping China&rsquo;s next wave.
        </p>
      </div>
    </RevealSection>
  );
}

export function AboutPage() {
  return (
    <article className={styles.page}>
      <AboutHero />
      <AboutStory />
      <AboutParticipants />
    </article>
  );
}
