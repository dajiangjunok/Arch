import { AccessSection } from "./_components/access-section";
import { ApplySection } from "./_components/apply-section";
import { FuxingIslandSection } from "./_components/fuxing-island-section";
import { HeroSection } from "./_components/hero-section";
import { JourneySection } from "./_components/journey-section";
import { WeeksSection } from "./_components/weeks-section";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper text-ink">
      <HeroSection />
      <JourneySection />
      <FuxingIslandSection />
      <WeeksSection />
      <AccessSection />
      <ApplySection />
    </main>
  );
}
