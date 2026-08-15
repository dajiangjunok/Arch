import type { Metadata } from "next";
import { ReferenceEffects } from "./reference-effects";
import { ReferenceHeader } from "./reference-header";
import { referencePages, type ReferencePageId } from "./generated/reference-pages";
import "./reference.css";

export const referenceMetadata: Record<ReferencePageId, Metadata> = {
  home: {
    title: "The Arch. | Shanghai Innovation Immersion",
    description: "A three-week China innovation immersion across Shanghai, Beijing and Shenzhen.",
  },
  week1: {
    title: "Week 1: AI & Model Frontiers | The Arch.",
    description: "Seven days inside China's AI product and model ecosystem.",
  },
  week2: {
    title: "Week 2: Embodied AI & Humanoid Robots | The Arch.",
    description: "Seven days inside China's embodied AI and robotics ecosystem.",
  },
  week3: {
    title: "Week 3: Smart Hardware & Wearables | The Arch.",
    description: "Seven days inside China's smart hardware and wearables ecosystem.",
  },
};

export function ReferencePage({ page }: { page: ReferencePageId }) {
  const content = referencePages[page];

  return (
    <main className={`arch-reference arch-${page}`}>
      <ReferenceHeader page={page} />
      <div dangerouslySetInnerHTML={{ __html: content.markup }} />
      <ReferenceEffects page={page} days={content.days} chipDayMap={content.chipDayMap} />
    </main>
  );
}
