import type { CompanyData, ImageData } from "../types";

export const homeHero = {
  moments: [
    {
      src: "/reference/45609c5450c39032.jpg",
      alt: "Fuxing Island",
      label: "Fuxing Island",
      rotation: "-2deg",
    },
    {
      src: "/reference/068b80dfaff35db1.jpg",
      alt: "Founder Talk",
      label: "Founder Talk",
      rotation: "1.5deg",
    },
    {
      src: "/reference/48d4732c27e6c833.jpg",
      alt: "Lab Visit",
      label: "Lab Visit",
      rotation: "-1deg",
    },
    {
      src: "/reference/21b7f0fb4ee0f403.jpg",
      alt: "Cohort Dinner",
      label: "Cohort Dinner",
      rotation: "2deg",
    },
    {
      src: "/reference/7d2d673461319153.jpg",
      alt: "Riverfront Night",
      label: "Riverfront Night",
      rotation: "-1.5deg",
    },
  ] satisfies ImageData[],
};

export const programStats = [
  { value: "21", label: ["Days", "Nov 1 – Nov 21"] },
  { value: "3", label: ["Cities", "Shanghai · Beijing · Shenzhen"] },
  { value: "50", suffix: "+", label: ["Companies &", "Institutions"] },
  { value: "60", suffix: "+", label: ["Featured", "Guests"] },
  { value: "3", label: ["Themed", "Weeks"] },
] as const;

export const programWeeks = [
  {
    number: "01",
    href: "/week1",
    className: "wk1",
    title: "Week 1 — AI Everywhere in Work & Life",
    location: "Shanghai · Nov 1–7",
    image: "/reference/e6a0f4634f01b510.jpg",
    points: [
      "AI + Manufacturing",
      "AI + Enterprise Productivity",
      "AI + Health Across All Ages",
    ],
  },
  {
    number: "02",
    href: "/week2",
    className: "wk2 wk-featured",
    title: "Week 2 — Embodied AI & Humanoid Robots",
    location: "Shanghai + Beijing · Nov 8–14",
    image: "/reference/567a5c65454c411c.jpg",
    points: [
      "AI + Manufacturing",
      "AI + Healthcare",
      "AI + Mobility",
    ],
    flag: "Most Popular",
  },
  {
    number: "03",
    href: "/week3",
    className: "wk3",
    title: "Week 3 — Smart Hardware & Wearables",
    location: "Shanghai + Shenzhen · Nov 15–21",
    image: "/reference/ee47a6f1ed4076c2.jpg",
    points: [
      "AI + Consumer Electronics",
      "AI + Retail",
      "AI + Wearables",
    ],
  },
] as const;

export const homeCompanies: readonly CompanyData[] = [
  {
    name: "Kimi",
    description: "AI assistant & agent products — Week 1.",
    image: "/reference/288e0c898a6fca8c.png",
    imageAlt: "Kimi logo",
    initials: "KI",
    rotation: "-4deg",
  },
  {
    name: "MiniMax",
    description: "Multimodal foundation models — Week 1.",
    image: "/reference/63c48b3c26c12d69.png",
    imageAlt: "MiniMax logo",
    initials: "MM",
    rotation: "3deg",
  },
  {
    name: "VolcanoEngine",
    description: "ByteDance's AI cloud & model platform — Week 1.",
    image: "/reference/9c6e48d1477c144c.png",
    imageAlt: "VolcanoEngine logo",
    initials: "VE",
    rotation: "-2deg",
  },
  {
    name: "Fourier",
    description: "Rehab robotics to humanoids — Week 2.",
    image: "/reference/2affb9528f749d5d.png",
    imageAlt: "Fourier logo",
    initials: "FO",
    rotation: "5deg",
  },
  {
    name: "AGIBOT",
    description: "Humanoid robots at scale — Week 2.",
    image: "/reference/50c8e7747ef42a47.png",
    imageAlt: "AGIBOT logo",
    initials: "AG",
    rotation: "-3deg",
  },
  {
    name: "Alibaba",
    description: "Model, cloud & chip stack — Week 1.",
    image: "/reference/16e9af4852ce2f3a.png",
    imageAlt: "Alibaba logo",
    initials: "AL",
    rotation: "4deg",
  },
  {
    name: "ByteDance",
    description: "Agent platforms & model services — Week 1.",
    image: "/reference/bc66b1405b54eb1d.png",
    imageAlt: "ByteDance logo",
    initials: "BY",
    rotation: "-5deg",
  },
];

export const homeMarquee = [
  "Ant Group",
  "Alibaba",
  "TMiRob",
  "KEPLER",
  "Fudan University",
  "Tongji University",
  "HIKROBOT",
  "Anker Innovations",
  "UGREEN",
  "SHARGE",
  "Rokid",
  "Z·Pilot",
  "Ant Group",
  "Alibaba",
  "TMiRob",
] as const;

export const audiences = [
  {
    title: "Founders, Builders & Makers",
    tag: "Supply chains · Talent · Execution",
    className: "a1",
  },
  {
    title: "Investors",
    tag: "Deal flow · Diligence · Co-invest",
    className: "a2",
  },
  {
    title: "Business Executives & Institutions",
    tag: "Platform · Policy · Partnerships",
    className: "a3",
  },
] as const;
