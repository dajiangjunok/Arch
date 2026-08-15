import type { Metadata } from "next";
import { HomePage } from "./home-page";
import { ReferenceHeader } from "./reference-header";
import { ScrollProgress } from "./components/interactive";
import { weekPages } from "./data/week-pages";
import { WeekPage } from "./week-page";
import type { ReferencePageId } from "./types";
import "./reference.css";
import "./account-menu.css";
import "./react-components.css";

export const referenceMetadata: Record<ReferencePageId, Metadata> = {
  home: {
    title: "The Arch. | Shanghai Innovation Immersion",
    description:
      "A three-week China innovation immersion across Shanghai, Beijing and Shenzhen.",
  },
  week1: {
    title: "Week 1: AI & Model Frontiers | The Arch.",
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
};

export function ReferencePage({ page }: { page: ReferencePageId }) {
  return (
    <main className={`arch-reference arch-${page}`}>
      <ScrollProgress />
      <ReferenceHeader page={page} />
      {page === "home" ? <HomePage /> : <WeekPage data={weekPages[page]} />}
    </main>
  );
}
