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
  { value: "4", label: ["Cities", "Shanghai · Beijing · Hangzhou · Shenzhen"] },
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
    flag: "Most Popular",
    title: "Week 2 — Embodied AI & Humanoid Robots",
    location: "Shanghai + Beijing + Hangzhou · Nov 8–14",
    image: "/reference/567a5c65454c411c.jpg",
    points: [
      "Upstream: Core Components & Systems",
      "Midstream: Full Robot Systems",
      "Downstream: Application Scenarios",
    ],
  },
  {
    number: "03",
    href: "/week3",
    className: "wk3",
    title: "Week 3 — Smart Hardware & longevity",
    location: "Shanghai + Shenzhen · Nov 15–21",
    image: "/reference/ee47a6f1ed4076c2.jpg",
    points: [
      "AI + Consumer Electronics",
      "Al + Longevity",
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

export const singleWeekBenefits = [
  "Full access to the week's company, factory and lab visits",
  "Closed-door founder and investor sessions, plus B2B meetings with Chinese companies",
  "Accommodation for the week",
  "Breakfast, lunch and dinner, including the program's official dinners",
  "All transport within China for the week, including domestic flights between cities and airport pickups",
  "Professional interpretation",
  "A team on the ground with you throughout",
] as const;

export const fellowshipBenefits = [
  "Hotel accommodation in Shanghai for your selected week(s)",
  "Coworking and build space, shared with the rest of the cohort",
  "Member-led events: Arch mixers, talks and meetups, or host your own",
  "The global builder network: founders, makers, creators and remote professionals",
  "Group meals at select community gatherings",
  "Flexible 1 to 3 week stay, on your own work rhythm",
] as const;

export const fellowshipStays = [
  { weeks: 1, ticketId: "fellowship_single_week", label: "1 Week", note: "Choose Week 1, 2, or 3", saving: null },
  { weeks: 2, ticketId: "fellowship_two_weeks", label: "2 Weeks", note: "Choose any two weeks", saving: "Save 20%" },
  { weeks: 3, ticketId: "fellowship_full_program", label: "3 Weeks", note: "Includes all three weeks", saving: "Save 33%" },
] as const;

export const excludedExpenses = [
  "International flights to and from China",
  "Travel insurance",
  "Personal spending outside the program",
  "Any side trips or self-arranged travel",
] as const;

export const travelNotes = [
  { title: "Visa", description: "we provide an official invitation letter to support your application" },
  { title: "Flights", description: "we’ll share the best routes into Shanghai once you’re confirmed" },
  { title: "Insurance", description: "a vetted list, so you’re covered before you land" },
] as const;
