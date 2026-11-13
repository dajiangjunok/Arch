import { ArchImage } from "../shared";
import { RevealSection } from "../interactive";
import styles from "./fuxing-island.module.css";

export function FuxingIsland() {
  return (
    <RevealSection id="fuxing-island" className={styles.section}>
      <div className="wrap">
        <header className={styles.header}>
          <p className={styles.eyebrow}>THE PLACE · FUXING ISLAND, SHANGHAI</p>
          <h2 className={styles.title}>
            Where Ships Once Launched, <em>New Ideas Take Shape.</em>
          </h2>
        </header>
        <div className={styles.layout}>
          <div className={styles.photo}>
            <ArchImage
              src="/reference/45609c5450c39032.png"
              alt="Aerial view of Fuxing Island's historic shipyards and waterfront along the Huangpu River in Shanghai"
              sizes="(min-width: 1240px) 590px, (min-width: 960px) 50vw, (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)"
            />
          </div>
          <div className={styles.copy}>
            <p className={styles.intro}>
              Once a center of Shanghai&apos;s shipbuilding industry, Fuxing
              Island is entering a new chapter.
            </p>
            <p>
              Set along the Huangpu River, this former industrial island is being
              reimagined as a hub for technology, creativity, and entrepreneurship.
              Historic shipyards and factories are finding new life as spaces for
              experimentation, collaboration, and innovation.
            </p>
            <p>
              For The Arch, Fuxing Island is more than a location. It&apos;s where
              builders from different backgrounds come together, exchange ideas,
              and turn possibilities into something real.
            </p>
            <p className={styles.closing}>
              A place built on making things. Now, a place for building what&apos;s
              next.
            </p>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
