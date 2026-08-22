import type { Metadata } from "next";
import { HomePage } from "./home-page";
import { FaqPage } from "./faq-page";
import { PartnersPage } from "./partners-page";
import { ReferenceHeader } from "./reference-header";
import { ScrollProgress } from "./components/interactive";
import { weekPages } from "./data/week-pages";
import { WeekPage } from "./week-page";
import type { ReferencePageId } from "./types";
import "./reference.css";
import "./account-menu.css";
import "./react-components.css";
import "./info-pages.css";

export const referenceMetadata: Record<ReferencePageId, Metadata> = {
  home: {
    title: "The Arch. | Shanghai Innovation Immersion",
    description:
      "A three-week China innovation immersion across Shanghai, Beijing and Shenzhen.",
  },
  week1: {
    title: "Week 1: AI Everywhere in Work & Life | The Arch.",
    description: "Seven days inside China's AI product and model ecosystem.",
  },
  week2: {
    title: "Week 2: Embodied AI & Humanoid Robots | The Arch.",
    description:
      "Seven days inside China's embodied AI and robotics ecosystem.",
  },
  week3: {
    title: "Week 3: Smart Hardware & Wearables | The Arch.",
    description:
      "Seven days inside China's smart hardware and wearables ecosystem.",
  },
  faq: {
    title: "FAQ | The Arch.",
    description:
      "Answers about applications, pricing, inclusions, logistics and partnerships for The Arch.",
  },
  partners: {
    title: "Partners | The Arch.",
    description:
      "Partner with The Arch and meet founders, investors and operators inside China's technology ecosystem.",
  },
};

export function ReferencePage({ page }: { page: ReferencePageId }) {
  return (
    <main className={`arch-reference arch-${page}`}>
      <ScrollProgress />
      <ReferenceHeader page={page} />
      {page === "home" ? <HomePage /> : null}
      {page === "faq" ? <FaqPage /> : null}
      {page === "partners" ? <PartnersPage /> : null}
      {page === "week1" || page === "week2" || page === "week3" ? (
        <WeekPage data={weekPages[page]} />
      ) : null}
    </main>
  );
}
