export const mailto =
  "mailto:business@globalpropeller.com?subject=The%20Arch.%20%E2%80%94%20Invitation%20Request";

export const applyPath = "/apply";

export const pillars = [
  { label: "PROGRAM", href: "#weeks" },
  { label: "COMPANIES", href: "#collection" },
  { label: "WHY US", href: "#thesis" },
  { label: "WHO IT'S FOR", href: "#audiences" },
  { label: "PRICING", href: "#admission" },
  { label: "APPLY", href: applyPath },
];

export const programGates = [
  {
    week: "Week 1",
    number: "01",
    title: "The AI Application Frontier",
    dates: "Shanghai + Beijing",
    tone: "navy",
    points: ["AI consumer products", "Model ecosystem", "Closed-door founder sessions"],
  },
  {
    week: "Week 2",
    number: "02",
    title: "Embodied AI & Robotics",
    dates: "Shanghai + Shenzhen",
    tone: "marigold",
    points: ["Robot labs & industrial demos", "Shenzhen hardware & supply chain trip", "Founder & operator meetups"],
  },
  {
    week: "Week 3",
    number: "03",
    title: "Smart Wearables & Spatial Computing",
    dates: "Shanghai",
    tone: "navy",
    points: ["Smart glasses & wearables", "Health & longevity tech", "Closing showcase & networking"],
  },
];

export const collection = [
  {
    company: "SenseTime",
    subject: "SenseCore / Applied AI",
    meta: "Nov 3 · Zhangjiang",
    art: "sun",
  },
  {
    company: "ByteDance",
    subject: "Coze / Volcano Engine",
    meta: "Nov 4 · Yangpu",
    art: "circle",
  },
  {
    company: "Ant Group",
    subject: "Embodied AI / Health",
    meta: "Nov 5 · Shanghai",
    art: "arch",
  },
  {
    company: "Alibaba",
    subject: "LLMs / Cloud / T-Head",
    meta: "Nov 6 · Xuhui",
    art: "blocks",
  },
  {
    company: "AGIBOT",
    subject: "Zhiyuan Robotics",
    meta: "Nov 9 · Zhangjiang",
    art: "tower",
  },
  {
    company: "Rokid",
    subject: "AR Glasses / Spatial Computing",
    meta: "Nov 18 · Week 3",
    art: "lens",
  },
];

export const thesisTags = [
  ["SFO", "Founder access"],
  ["LHR", "Capital network"],
  ["SIN", "Market bridge"],
  ["NRT", "Hardware route"],
];

export const audiences = [
  {
    title: "Founders",
    detail: "Supply chains · Talent · Execution",
    tone: "navy",
  },
  {
    title: "Investors",
    detail: "Deal flow · Diligence · Co-invest",
    tone: "marigold",
  },
  {
    title: "Business Executive",
    detail: "Platform · Audience · Signal",
    tone: "navy-alt",
  },
  {
    title: "Institutions",
    detail: "Policy · Research · Partnerships",
    tone: "ivory",
  },
];

export const admissionPasses = [
  {
    code: "ADM · 001",
    name: "Single Week Pass",
    duration: "One Week",
    note: "Choose Week 1, 2, or 3",
    tone: "ivory",
    rotate: "-rotate-1",
    inclusions: ["Local transportation", "Daily meals", "Travel insurance", "Full week program access"],
  },
  {
    code: "ADM · 002",
    name: "Multi-Week Pass",
    duration: "Two Weeks",
    note: "Any two of three weeks",
    tone: "marigold",
    rotate: "rotate-1",
    inclusions: ["Local transportation", "Daily meals", "Travel insurance", "Two-week program access"],
  },
  {
    code: "ADM · 003",
    name: "Full Residency",
    duration: "Three Weeks",
    note: "Nov 1 - 21, complete immersion",
    tone: "navy",
    rotate: "-rotate-[0.7deg]",
    badge: "Best Value",
    inclusions: ["Local transportation", "Daily meals", "Travel insurance", "Full program access"],
  },
];
