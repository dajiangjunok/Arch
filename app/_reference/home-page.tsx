import { PropellerHero } from "./components/propeller-hero";
import { ProgramOverview } from "./components/home/program-overview";
import { ProgramStats } from "./components/home/program-stats";
import { ProgramWeeks } from "./components/home/program-weeks";
import { CompanyWall } from "./components/home/company-wall";
import { ProgramThesis } from "./components/home/program-thesis";
import { ProgramAudiences } from "./components/home/program-audiences";
import { ProgramOffer } from "./components/home/program-offer";
import { ProgramAdmission } from "./components/home/program-admission";
import styles from "./home-page.module.css";

export function HomePage() {
  return (
    <div className={styles.content}>
      <PropellerHero />
      <ProgramOverview />
      <ProgramStats />
      <ProgramWeeks />
      <CompanyWall />
      <ProgramThesis />
      <ProgramAudiences />
      <ProgramOffer />
      <ProgramAdmission />
    </div>
  );
}
