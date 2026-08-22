export type ReferencePageId = "home" | WeekPageId | "faq" | "partners";

export type WeekPageId = "week1" | "week2" | "week3";

export type ImageData = {
  src: string;
  alt: string;
  label?: string;
  rotation?: string;
};

export type TextSegment = {
  text: string;
  emphasis: boolean;
};

export type DayData = {
  n: string;
  img: string;
  date: string;
  tag: string;
  hl: string;
  title: string;
  body: string;
  badges: readonly string[];
};

export type PillarIconName =
  | "chat"
  | "model"
  | "session"
  | "humanoid"
  | "hardware"
  | "factory"
  | "product"
  | "wearable"
  | "market";

export type PillarData = {
  number: string;
  title: string;
  body: string;
  insight: string;
  image: string;
  icon: PillarIconName;
};

export type CompanyData = {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  rotation: string;
  darkLogo?: boolean;
  initials?: string;
};

export type WeekPageData = {
  id: WeekPageId;
  weekNumber: number;
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    meta: readonly string[];
    stampImage: string;
    stampLabel: string;
    stampStats: readonly { value: string; label: string }[];
    moments: readonly ImageData[];
  };
  overview: {
    title: readonly string[];
    body: string;
    pillars: readonly PillarData[];
  };
  itineraryNote: string;
  days: readonly DayData[];
  chipDayMap: Readonly<Record<string, number>>;
  companies: readonly CompanyData[];
  marquee: readonly string[];
  gain: {
    title: readonly string[];
    lead: readonly TextSegment[];
    image: ImageData;
    items: readonly { title: string; body: string }[];
    chips: readonly string[];
  };
  logistics: readonly {
    title: string;
    body: string;
    image: ImageData;
  }[];
  footerRows: readonly (readonly { href?: string; text: string }[])[];
};
