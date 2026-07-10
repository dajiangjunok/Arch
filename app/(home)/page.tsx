import { AdmissionSection } from "./_components/admission-section";
import { AudienceSection } from "./_components/audience-section";
import { BridgeProgress } from "./_components/bridge-progress";
import { CollectionSection } from "./_components/collection-section";
import { FooterSection } from "./_components/footer-section";
import { HeroSection } from "./_components/hero-section";
import { HomeEffects } from "./_components/home-effects";
import { ManifestoSection } from "./_components/manifesto-section";
import { ProgramGatesSection } from "./_components/program-gates-section";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-ivory text-ink">
      <HeroSection />
      <ProgramGatesSection />
      <CollectionSection />
      <ManifestoSection />
      <AudienceSection />
      <AdmissionSection />
      <FooterSection />
      <BridgeProgress />
      <HomeEffects />
    </main>
  );
}
