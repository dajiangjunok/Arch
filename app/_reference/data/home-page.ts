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
      src: "/reference/009cfaa2bc6a5606.jpg",
      alt: "Founder Talk",
      label: "Founder Talk",
      rotation: "1.5deg",
    },
    {
      src: "/reference/97c2971888848ff2.jpg",
      alt: "Lab Visit",
      label: "Lab Visit",
      rotation: "-1deg",
    },
    {
      src: "/reference/4d80bc2e0686db90.jpg",
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
  { value: "20", suffix: "+", label: ["Companies &", "Institutions"] },
  { value: "10", suffix: "+", label: ["Featured", "Guests"] },
  { value: "3", label: ["Themed", "Weeks"] },
] as const;

export const programWeeks = [
  {
    number: "01",
    href: "/week1",
    className: "wk1",
    title: "Week 1 — AI & Model Frontiers",
    location: "Shanghai + Beijing · Nov 1–7",
    image: "/reference/e6a0f4634f01b510.jpg",
    points: [
      "AI consumer products",
      "Model ecosystem",
      "Closed-door founder sessions",
    ],
  },
  {
    number: "02",
    href: "/week2",
    className: "wk2 wk-featured",
    title: "Week 2 — Embodied AI & Humanoid Robots",
    location: "Shanghai · Nov 8–14",
    image: "/reference/567a5c65454c411c.jpg",
    points: [
      "Humanoid robots at scale",
      "Core hardware & learning",
      "Deployment & manufacturing",
    ],
    flag: "Most Popular",
  },
  {
    number: "03",
    href: "/week3",
    className: "wk3",
    title: "Week 3 — Smart Hardware & Wearables",
    location: "Shenzhen + Shanghai · Nov 15–21",
    image: "/reference/ee47a6f1ed4076c2.jpg",
    points: [
      "Smart hardware & AI wearables",
      "Crowdfunding & global retail",
      "Founder showcase & closing forum",
    ],
  },
] as const;

export const homeCompanies: readonly CompanyData[] = [
  {
    name: "SenseTime",
    description: "Applied AI at scale — Week 1.",
    image: "/reference/59df25b169b0a349.png",
    imageAlt: "SenseTime logo",
    initials: "SE",
    rotation: "-4deg",
  },
  {
    name: "AGIBOT",
    description: "Humanoid robots at scale — Week 2.",
    image: "/reference/50c8e7747ef42a47.png",
    imageAlt: "AGIBOT logo",
    initials: "AG",
    rotation: "3deg",
  },
  {
    name: "DJI",
    description: "Global hardware leader — Week 3.",
    image: "/reference/a539a046c86be70f.png",
    imageAlt: "DJI logo",
    initials: "DJ",
    rotation: "-2deg",
  },
  {
    name: "ByteDance",
    description: "Agent platforms & model services — Week 1.",
    image: "/reference/bc66b1405b54eb1d.png",
    imageAlt: "ByteDance logo",
    initials: "BY",
    rotation: "5deg",
  },
  {
    name: "Fourier",
    description: "Rehab robotics to humanoids — Week 2.",
    image: "/reference/2affb9528f749d5d.png",
    imageAlt: "Fourier logo",
    initials: "FO",
    rotation: "-3deg",
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
    title: "Founders",
    tag: "Supply chains · Talent · Execution",
    className: "a1",
  },
  {
    title: "Investors",
    tag: "Deal flow · Diligence · Co-invest",
    className: "a2",
  },
  {
    title: "Business Executives",
    tag: "Platform · Audience · Signal",
    className: "a3",
  },
  {
    title: "Institutions",
    tag: "Policy · Research · Partnerships",
    className: "a4",
  },
] as const;
