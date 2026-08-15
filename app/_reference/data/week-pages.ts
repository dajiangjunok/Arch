import type { WeekPageData, WeekPageId } from "../types";

export const weekPages = {
  week1: {
    id: "week1",
    weekNumber: 1,
    hero: {
      eyebrow: "Shanghai + Beijing · Nov 1–7",
      title: "AI & Model",
      accent: "Frontiers",
      meta: ["7 Days / 6 Nights", "Shanghai + Beijing", "Application Only"],
      stampImage: "/reference/5806e79f0804dc44.jpg",
      stampLabel: "Week One of Three",
      stampStats: [
        {
          value: "7",
          label: "Days on the ground",
        },
        {
          value: "8+",
          label: "Labs & platforms",
        },
        {
          value: "5",
          label: "Founder sessions",
        },
      ],
      moments: [
        {
          src: "/reference/27468c57b8287d23.jpg",
          alt: "Model Lab",
          label: "Model Lab",
          rotation: "-2deg",
        },
        {
          src: "/reference/009cfaa2bc6a5606.jpg",
          alt: "Founder Talk",
          label: "Founder Talk",
          rotation: "1.5deg",
        },
        {
          src: "/reference/4d80bc2e0686db90.jpg",
          alt: "Cohort Dinner",
          label: "Cohort Dinner",
          rotation: "-1deg",
        },
        {
          src: "/reference/85d6423258e051eb.jpg",
          alt: "Beijing Session",
          label: "Beijing Session",
          rotation: "2deg",
        },
        {
          src: "/reference/b05ab5e1ea477a5a.jpg",
          alt: "City Walk",
          label: "City Walk",
          rotation: "-1.5deg",
        },
      ],
    },
    overview: {
      title: ["From Research Labs", "to Daily Products"],
      body: "Week 1 follows intelligence as it leaves the research lab and becomes something people actually use — through model teams, consumer AI products, and the platforms and founders that compete for daily habits.",
      pillars: [
        {
          number: "01",
          title: "AI Consumer Products",
          body: "Chat and agent products, AI-native apps, and the teams designing for daily, habitual use.",
          insight:
            "Watch for: what keeps someone opening the app on day 30, not just day one.",
          image: "/reference/c5f8adcae4e7ca29.jpg",
          icon: "chat",
        },
        {
          number: "02",
          title: "Model Ecosystem",
          body: "Foundation model labs, open-weight releases, and the infrastructure that supports them.",
          insight:
            "Watch for: how a model release turns into a shipped product feature within weeks.",
          image: "/reference/65a59ae003f2c940.jpg",
          icon: "model",
        },
        {
          number: "03",
          title: "Closed-Door Founder Sessions",
          body: "Private conversations on strategy, competition, and international expansion.",
          insight:
            "Watch for: what founders say off the record that never makes it into a pitch deck.",
          image: "/reference/3e9e60004007ebc9.jpg",
          icon: "session",
        },
      ],
    },
    itineraryNote:
      "Tap a card to open the day — it'll ping like a notification received. Full session detail lives in the downloadable dossier.",
    days: [
      {
        n: "01",
        img: "/reference/009cfaa2bc6a5606.jpg",
        date: "Nov 1 · Sun",
        tag: "Arrival",
        hl: "Touch down in Shanghai, meet the cohort.",
        title: "Arrival & First Connections",
        body: "Arrival, check-in, and an open evening to connect with the group before the program begins.",
        badges: ["Community"],
      },
      {
        n: "02",
        img: "/reference/27468c57b8287d23.jpg",
        date: "Nov 2 · Mon",
        tag: "Landscape",
        hl: "What makes an AI product something people use every day?",
        title: "The AI Consumer Landscape",
        body: "A landscape briefing on China's AI ecosystem, followed by a visit to an AI application or smart manufacturing company, closing with an evening of city conversation.",
        badges: ["AI + Ecosystem"],
      },
      {
        n: "03",
        img: "/reference/97c2971888848ff2.jpg",
        date: "Nov 3 · Tue",
        tag: "Applied AI",
        hl: "SenseTime's SenseCore — from research lab to commercial scale.",
        title: "Applied AI at SenseTime",
        body: "SenseTime's large-scale AI infrastructure spans computer vision, generative AI, and enterprise deployment. The visit looks at how research capability becomes a deployable product across industries.",
        badges: ["SenseTime", "Zhangjiang"],
      },
      {
        n: "04",
        img: "/reference/6c023b039a82749c.jpg",
        date: "Nov 4 · Wed",
        tag: "ByteDance",
        hl: "Coze and Volcano Engine — agent platforms with existing distribution.",
        title: "Agents, Assistants & the Creator Economy",
        body: "ByteDance's AI product and infrastructure teams on building agent platforms and model services for both consumers and developers — how a company with existing distribution designs AI products.",
        badges: ["ByteDance", "Yangpu"],
      },
      {
        n: "05",
        img: "/reference/953204bb4ef6ae03.jpg",
        date: "Nov 5 · Thu",
        tag: "Platforms",
        hl: "Ant Group's embodied AI bets, then Alibaba's model and cloud stack.",
        title: "Platforms, Payments & Cloud AI",
        body: "Ant Group on incubating new AI product categories inside a platform company, and Alibaba on how model development, cloud infrastructure, and chip design connect across one organisation.",
        badges: ["Ant Group", "Alibaba"],
      },
      {
        n: "06",
        img: "/reference/85d6423258e051eb.jpg",
        date: "Nov 6 · Fri",
        tag: "Beijing",
        hl: "Travel to Beijing for closed-door founder sessions.",
        title: "Beijing Model Labs & Founder Sessions",
        body: "The group travels to Beijing to meet foundation-model labs and early-stage founders, closing with an off-the-record session on strategy, competition, and international expansion.",
        badges: ["Closed-Door", "Beijing"],
      },
      {
        n: "07",
        img: "/reference/4d80bc2e0686db90.jpg",
        date: "Nov 7 · Sat",
        tag: "Closing",
        hl: "Reflect, connect the dots, and travel on to Shanghai.",
        title: "Closing & Onward Travel",
        body: "A flexible morning, closing reflections on the week, and departure with the group back to Shanghai ahead of Week 2.",
        badges: ["Closing"],
      },
    ],
    chipDayMap: {
      "AI Consumer Products": 1,
      "Foundation Models": 2,
      "Agents & Assistants": 3,
      "Platform Strategy": 4,
      "Founder Access": 5,
      "Global Distribution": 4,
    },
    companies: [
      {
        name: "SenseTime",
        description:
          "Applied AI infrastructure, from computer vision to generative AI at scale.",
        image: "/reference/59df25b169b0a349.png",
        imageAlt: "SenseTime logo",
        rotation: "-4deg",
      },
      {
        name: "ByteDance",
        description:
          "Agent platforms and model services built on existing consumer distribution.",
        image: "/reference/bc66b1405b54eb1d.png",
        imageAlt: "ByteDance logo",
        rotation: "3deg",
      },
      {
        name: "Ant Group",
        description:
          "Incubating embodied AI and health products inside a platform company.",
        image: "/reference/38a58d08c79ed6d0.png",
        imageAlt: "Ant Group logo",
        rotation: "-2deg",
      },
      {
        name: "Alibaba Cloud",
        description:
          "Model development, cloud infrastructure, and chip design under one roof.",
        image: "/reference/16e9af4852ce2f3a.png",
        imageAlt: "Alibaba Cloud logo",
        rotation: "5deg",
      },
    ],
    marquee: [
      "Beijing Model Labs",
      "Closed-Door Founders",
      "VC / PE Roundtable",
    ],
    companyNote:
      "Placeholder logos shown — swap in real company photos anytime.",
    gain: {
      title: ["Judgment, Not", "Just a Demo"],
      lead: [
        {
          text: "By week's end you'll have",
          emphasis: false,
        },
        {
          text: "a working map",
          emphasis: true,
        },
        {
          text: "of China's AI ecosystem — not a stack of screenshots.",
          emphasis: false,
        },
      ],
      image: {
        src: "/reference/22b66269477f333d.jpg",
        alt: "Cohort in the Field",
        label: "Cohort in the Field",
        rotation: "0deg",
      },
      items: [
        {
          title: "See the AI ecosystem fit together",
          body: "Model labs, product teams, platforms, and capital — how they connect.",
        },
        {
          title: "Build real judgment",
          body: "What actually makes an AI product sticky, beyond a benchmark score.",
        },
        {
          title: "Leave with live connections",
          body: "Product collaborations and intros — carried forward after the week ends.",
        },
      ],
      chips: [
        "AI Consumer Products",
        "Foundation Models",
        "Agents & Assistants",
        "Platform Strategy",
        "Founder Access",
        "Global Distribution",
      ],
    },
    guests: [
      {
        initials: "ZL",
        name: "Zixuan Li",
        roles: ["Head of Zhipu Z.ai"],
        description:
          "Leads Zhipu's Z.ai division, one of China's frontier large-model labs.",
        rotation: "-3deg",
      },
      {
        initials: "ZC",
        name: "Zili Chen",
        roles: ["Director", "Apache Software Foundation"],
        description:
          "Serves on the board of the Apache Software Foundation, steering global open-source infrastructure.",
        rotation: "2deg",
      },
      {
        initials: "XW",
        name: "Xu Wang",
        roles: ["Vice Chair", "Ant Group Open Source Technology Committee"],
        description:
          "Helps set open-source technology strategy across Ant Group.",
        rotation: "-2deg",
      },
      {
        initials: "MY",
        name: "Michael Yuan",
        roles: ["Founder", "WasmEdge"],
        description:
          "Founded WasmEdge, a leading WebAssembly runtime used across edge and AI infrastructure.",
        rotation: "4deg",
      },
    ],
    logistics: [
      {
        title: "Shanghai + Beijing Bases",
        body: "Shared accommodation is included in both cities. Staying with the group is where the real connections happen — over meals, transport, and evenings.",
        image: {
          src: "/reference/342f3eb92ccf8840.jpg",
          alt: "Shared Housing",
          label: "Shared Housing",
          rotation: "0deg",
        },
      },
      {
        title: "Transport & Language",
        body: "Airport transfers, local transport, and Chinese–English interpretation throughout. The Shanghai–Beijing travel leg is confirmed closer to the date.",
        image: {
          src: "/reference/232ebb8c37e4774c.jpg",
          alt: "On the Road",
          label: "On the Road",
          rotation: "0deg",
        },
      },
    ],
    footerRows: [
      [
        {
          href: "/",
          text: "← Full three-week program",
        },
        {
          href: "mailto:business@globalpropeller.com",
          text: "business@globalpropeller.com",
        },
        {
          href: "/week2",
          text: "Week 2 →",
        },
      ],
      [
        {
          href: "/",
          text: "← Back to full program",
        },
        {
          href: "/week2",
          text: "Week 2 — Embodied AI & Humanoid Robots →",
        },
      ],
    ],
  },
  week2: {
    id: "week2",
    weekNumber: 2,
    hero: {
      eyebrow: "Shanghai Program · Nov 8–14",
      title: "Embodied AI",
      accent: "& Humanoid Robots",
      meta: ["6 Days / 5 Nights", "Shanghai, China", "Application Only"],
      stampImage: "/reference/567a5c65454c411c.jpg",
      stampLabel: "Week Two of Three",
      stampStats: [
        {
          value: "7",
          label: "Days on the ground",
        },
        {
          value: "14+",
          label: "Companies & labs",
        },
        {
          value: "5",
          label: "Guest speakers",
        },
      ],
      moments: [
        {
          src: "/reference/97c2971888848ff2.jpg",
          alt: "Lab Visit",
          label: "Lab Visit",
          rotation: "-2deg",
        },
        {
          src: "/reference/009cfaa2bc6a5606.jpg",
          alt: "Founder Talk",
          label: "Founder Talk",
          rotation: "1.5deg",
        },
        {
          src: "/reference/4d80bc2e0686db90.jpg",
          alt: "Cohort Dinner",
          label: "Cohort Dinner",
          rotation: "-1deg",
        },
        {
          src: "/reference/953204bb4ef6ae03.jpg",
          alt: "Robot Lab",
          label: "Robot Lab",
          rotation: "2deg",
        },
        {
          src: "/reference/b05ab5e1ea477a5a.jpg",
          alt: "City Walk",
          label: "City Walk",
          rotation: "-1.5deg",
        },
      ],
    },
    overview: {
      title: ["From Models to", "Working Robots"],
      body: "Week 2 follows intelligence as it leaves the screen and enters a body — through humanoid labs, hospital robots, dexterous hands, and the factories that build them at scale.",
      pillars: [
        {
          number: "01",
          title: "Humanoid Robots & Embodied Models",
          body: "General-purpose robots and the models that give them movement, interaction, and task execution.",
          insight:
            "Watch for: how one model transfers across different robot bodies without retraining from scratch.",
          image: "/reference/08ffb46e71f060a2.jpg",
          icon: "humanoid",
        },
        {
          number: "02",
          title: "Core Hardware & Learning",
          body: "Dexterous hands, sensors, simulation, and the university research behind them.",
          insight:
            "Watch for: the gap between a hand that grips in a demo and one that grips reliably, every time.",
          image: "/reference/65a59ae003f2c940.jpg",
          icon: "hardware",
        },
        {
          number: "03",
          title: "Deployment & Scale",
          body: "Healthcare, industry, and the supply chains that turn a demo into a product.",
          insight:
            "Watch for: what breaks first when a robot goes from one unit to one thousand.",
          image: "/reference/78b20ea3a907d52b.jpg",
          icon: "factory",
        },
      ],
    },
    itineraryNote:
      "Tap a ticket to open the day — it'll give a satisfying little stamp. Full session detail lives in the downloadable dossier.",
    days: [
      {
        n: "01",
        img: "/reference/009cfaa2bc6a5606.jpg",
        date: "Nov 8 · Sun",
        tag: "Arrival",
        hl: "Touch down, meet the cohort.",
        title: "Arrival & First Connections",
        body: "Arrival, check-in, and an open evening to connect with the group before the program begins.",
        badges: ["Community"],
      },
      {
        n: "02",
        img: "/reference/cdbb6c300cd958fd.jpg",
        date: "Nov 9 · Mon",
        tag: "Landscape",
        hl: "Mapping the ecosystem, then DEXMAL's one-model-many-bodies approach.",
        title: "Embodied Models & DEXMAL",
        body: "A landscape briefing on China's embodied AI ecosystem, followed by a visit to DEXMAL — embodied-native models that connect one model to multiple robot bodies across logistics, services, and research.",
        badges: ["DEXMAL", "Embodied Models"],
      },
      {
        n: "03",
        img: "/reference/7f9b3acff3f5bf89.jpg",
        date: "Nov 10 · Tue",
        tag: "Hardware",
        hl: "The hardware behind a humanoid demo — grip, force, repeatability.",
        title: "Dexterous Hands & Core Hardware",
        body: "A hands-on look at actuators, sensors, and dexterous-hand technology — the components that decide what a robot can physically do, beyond the polish of a stage demo.",
        badges: ["Robot Hardware", "Host TBC"],
      },
      {
        n: "04",
        img: "/reference/953204bb4ef6ae03.jpg",
        date: "Nov 11 · Wed",
        tag: "Humanoids",
        hl: "AGIBOT, TMiRob, and KEPLER — three takes on the humanoid race.",
        title: "Humanoids at Scale",
        body: "AGIBOT on producing humanoids at scale, TMiRob on robots working safely in real hospitals, and KEPLER on humanoids built for the workplace — closing with dinner in Xintiandi.",
        badges: ["AGIBOT", "TMiRob", "KEPLER"],
      },
      {
        n: "05",
        img: "/reference/97c2971888848ff2.jpg",
        date: "Nov 12 · Thu",
        tag: "Research",
        hl: "Fourier's 40-country track record, then inside Fudan and Tongji's labs.",
        title: "Rehab to Humanoid, Lab to Field",
        body: "Fourier's path from rehabilitation robotics to humanoids serving 2,000+ institutions worldwide, followed by robotics research at Fudan and Tongji University.",
        badges: ["Fourier", "Fudan", "Tongji"],
      },
      {
        n: "06",
        img: "/reference/0095afc8516fb38c.jpg",
        date: "Nov 13 · Fri",
        tag: "Scale",
        hl: "From single robots to a full manufacturing ecosystem.",
        title: "Industrial Scale",
        body: "A regional visit to HIKROBOT's Tonglu manufacturing base, plus Shanghai's new Embodied Intelligence Global Co-Innovation Center in Jing'an.",
        badges: ["HIKROBOT", "Jing'an"],
      },
      {
        n: "07",
        img: "/reference/4d80bc2e0686db90.jpg",
        date: "Nov 14 · Sat",
        tag: "Closing",
        hl: "Reflect, connect the dots, and travel on to Shenzhen.",
        title: "Closing & Onward Travel",
        body: "A flexible morning, closing reflections on the week, and departure with the group toward Week 3 in Shenzhen.",
        badges: ["Closing"],
      },
    ],
    chipDayMap: {
      "Embodied Models": 1,
      "Dexterous Hands": 2,
      "Humanoid Robots": 3,
      "Medical Robotics": 3,
      "Robot Learning": 4,
      "Smart Manufacturing": 5,
    },
    companies: [
      {
        name: "DEXMAL",
        description:
          "Embodied-native models, one brain across many robot bodies.",
        image: "/reference/9d2354c2feebed48.png",
        imageAlt: "DEXMAL logo",
        rotation: "-4deg",
      },
      {
        name: "AGIBOT",
        description:
          "Humanoid robots moving fast from prototype to production scale.",
        image: "/reference/50c8e7747ef42a47.png",
        imageAlt: "AGIBOT logo",
        rotation: "3deg",
      },
      {
        name: "TMiRob",
        description:
          "Robots working safely inside real hospitals, around patients.",
        image: "/reference/dbd702c4f95d46de.png",
        imageAlt: "TMiRob logo",
        rotation: "-2deg",
      },
      {
        name: "KEPLER",
        description: "General-purpose humanoids built for real workplaces.",
        image: "/reference/5591d17205dc100f.png",
        imageAlt: "KEPLER logo",
        rotation: "5deg",
      },
      {
        name: "Fourier",
        description:
          "From rehab robotics to humanoids, in 2,000+ institutions.",
        image: "/reference/2affb9528f749d5d.png",
        imageAlt: "Fourier logo",
        rotation: "-3deg",
      },
    ],
    marquee: ["Fudan University", "Tongji University", "HIKROBOT"],
    companyNote:
      "Placeholder logos shown — swap in real company photos anytime.",
    gain: {
      title: ["Judgment, Not", "Just a Tour"],
      lead: [
        {
          text: "By week's end you'll have",
          emphasis: false,
        },
        {
          text: "a working map",
          emphasis: true,
        },
        {
          text: "of China's embodied AI ecosystem — not a stack of photos.",
          emphasis: false,
        },
      ],
      image: {
        src: "/reference/22b66269477f333d.jpg",
        alt: "Cohort in the Field",
        label: "Cohort in the Field",
        rotation: "0deg",
      },
      items: [
        {
          title: "See the ecosystem fit together",
          body: "Model teams, manufacturers, universities, and capital — how they connect.",
        },
        {
          title: "Build real judgment",
          body: "What actually makes a robot deployable, beyond the polish of a demo.",
        },
        {
          title: "Leave with live connections",
          body: "Pilots, partnerships, and intros — carried forward after the week ends.",
        },
      ],
      chips: [
        "Embodied Models",
        "Humanoid Robots",
        "Dexterous Hands",
        "Medical Robotics",
        "Robot Learning",
        "Smart Manufacturing",
      ],
    },
    guests: [
      {
        initials: "JG",
        name: "Jie Gu",
        roles: ["Chairman & CEO", "Fourier Intelligence"],
        description:
          "Leads Fourier's move from rehabilitation robotics into humanoid platforms.",
        rotation: "-3deg",
      },
      {
        initials: "HF",
        name: "Haoqiang Fan",
        roles: ["Co-Founder", "DEXMAL"],
        description:
          "Co-founded DEXMAL, building embodied-native models across robot bodies.",
        rotation: "2deg",
      },
      {
        initials: "DL",
        name: "David Li",
        roles: ["Co-Founder", "Xinchejian, Shanghai"],
        description:
          "Co-founded Xinchejian, China's first makerspace, in Shanghai.",
        rotation: "-2deg",
      },
    ],
    logistics: [
      {
        title: "Shanghai Base",
        body: "Shared accommodation is included. Staying with the group is where the real connections happen — over meals, transport, and evenings.",
        image: {
          src: "/reference/342f3eb92ccf8840.jpg",
          alt: "Shared Housing",
          label: "Shared Housing",
          rotation: "0deg",
        },
      },
      {
        title: "Transport & Language",
        body: "Airport transfers, local transport, and Chinese–English interpretation throughout. Onward transport to Shenzhen for Week 3 confirmed closer to the date.",
        image: {
          src: "/reference/232ebb8c37e4774c.jpg",
          alt: "On the Road",
          label: "On the Road",
          rotation: "0deg",
        },
      },
    ],
    footerRows: [
      [
        {
          href: "/",
          text: "← Full three-week program",
        },
        {
          href: "mailto:business@globalpropeller.com",
          text: "business@globalpropeller.com",
        },
        {
          href: "/week3",
          text: "Week 3 →",
        },
      ],
      [
        {
          href: "/week1",
          text: "← Week 1 — AI & Model Frontiers",
        },
        {
          href: "/week3",
          text: "Week 3 — Smart Hardware & Wearables →",
        },
      ],
    ],
  },
  week3: {
    id: "week3",
    weekNumber: 3,
    hero: {
      eyebrow: "Shenzhen + Shanghai · Nov 15–21",
      title: "Smart Hardware",
      accent: "& Wearables",
      meta: ["7 Days / 6 Nights", "Shenzhen + Shanghai", "Application Only"],
      stampImage: "/reference/ee47a6f1ed4076c2.jpg",
      stampLabel: "Week Three of Three",
      stampStats: [
        {
          value: "7",
          label: "Days on the ground",
        },
        {
          value: "10+",
          label: "Companies & makers",
        },
        {
          value: "5",
          label: "Guest speakers",
        },
      ],
      moments: [
        {
          src: "/reference/huaqiangbei.jpg",
          alt: "Huaqiangbei",
          label: "Huaqiangbei",
          rotation: "-2deg",
        },
        {
          src: "/reference/0095afc8516fb38c.jpg",
          alt: "Factory Floor",
          label: "Factory Floor",
          rotation: "1.5deg",
        },
        {
          src: "/reference/97c2971888848ff2.jpg",
          alt: "Maker Space",
          label: "Maker Space",
          rotation: "-1deg",
        },
        {
          src: "/reference/e2201355ca0a7d23.jpg",
          alt: "Retail Floor",
          label: "Retail Floor",
          rotation: "2deg",
        },
        {
          src: "/reference/7d2d673461319153.jpg",
          alt: "Riverfront Night",
          label: "Riverfront Night",
          rotation: "-1.5deg",
        },
      ],
    },
    overview: {
      title: ["From Components", "to Global Markets"],
      body: "Week 3 follows a hardware idea as it leaves the workbench and reaches real users — through Shenzhen's electronics markets, global consumer brands, and the crowdfunding and retail floors that decide what ships.",
      pillars: [
        {
          number: "01",
          title: "Hardware, Supply Chains & Product Design",
          body: "Components, engineering, rapid iteration, and the systems behind reliable consumer products.",
          insight:
            "Watch for: how fast an idea moves from a part on a counter to a working device in Huaqiangbei.",
          image: "/reference/08ffb46e71f060a2.jpg",
          icon: "product",
        },
        {
          number: "02",
          title: "AI Wearables & Spatial Computing",
          body: "Smart rings, AI glasses, personal health devices, and new ways of interacting with technology.",
          insight:
            "Watch for: what it takes to fit useful AI into something small enough to forget you're wearing.",
          image: "/reference/78b20ea3a907d52b.jpg",
          icon: "wearable",
        },
        {
          number: "03",
          title: "Crowdfunding, Retail & Global Markets",
          body: "Kickstarter, brand building, experiential retail, and cross-border expansion.",
          insight:
            "Watch for: what changes the moment a crowdfunded prototype hits a physical shelf.",
          image: "/reference/e8caa21e93809941.jpg",
          icon: "market",
        },
      ],
    },
    itineraryNote:
      "Tap a card to open the day — it'll punch a little QC stamp. Full session detail lives in the downloadable dossier.",
    days: [
      {
        n: "01",
        img: "/reference/3fe5474a750b14df.jpg",
        date: "Nov 15 · Sun",
        tag: "Arrival",
        hl: "Touch down in Shenzhen, wander Huaqiangbei.",
        title: "Arrival & First Hardware Impressions",
        body: "Arrival and check-in, then an open evening browsing Huaqiangbei — one of the world's densest electronics markets, and a first taste of Shenzhen's hardware speed.",
        badges: ["Community", "Huaqiangbei"],
      },
      {
        n: "02",
        img: "/reference/0095afc8516fb38c.jpg",
        date: "Nov 16 · Mon",
        tag: "Global Brands",
        hl: "DJI and Anker — two very different playbooks for going global.",
        title: "How Chinese Hardware Reaches the World",
        body: "A landscape briefing, then DJI on turning hard engineering into trusted products, and Anker Innovations on building global consumer brands from Shenzhen — plus a crowdfunding roundtable and a stop at INNO100's retail floor.",
        badges: ["DJI", "Anker Innovations"],
      },
      {
        n: "03",
        img: "/reference/97c2971888848ff2.jpg",
        date: "Nov 17 · Tue",
        tag: "Makers",
        hl: "SHARGE and UGREEN, then what overseas and post-2000 makers are building.",
        title: "Design, Distribution & the Maker Scene",
        body: "SHARGE on design-led charging products, UGREEN on scaling from accessories into a full ecosystem, and two maker conversations — overseas founders and China's post-2000 builders — before the group returns to Shanghai.",
        badges: ["SHARGE", "UGREEN"],
      },
      {
        n: "04",
        img: "/reference/2507816e6a05f074.jpg",
        date: "Nov 18 · Wed",
        tag: "Wearables",
        hl: "An AI ring and AI glasses — two bets on the next computing form factor.",
        title: "AI Wearables & Spatial Computing",
        body: "Vocci on packing useful AI into a titanium ring, and Rokid on why glasses might be a different computing platform than a phone — closed out with a relaxed evening on the riverfront.",
        badges: ["Vocci", "Rokid"],
      },
      {
        n: "05",
        img: "/reference/b05ab5e1ea477a5a.jpg",
        date: "Nov 19 · Thu",
        tag: "Retail Lab",
        hl: "A 200-product retail floor, then a cross-border hardware forum.",
        title: "Retail as a Product Lab",
        body: "Z·Pilot's experience store inside the Shanghai Foundation Model Innovation Center, followed by a GEW China hardware forum on cross-border opportunities — closing with a walk along Suzhou Creek.",
        badges: ["Z·Pilot", "GEW China"],
      },
      {
        n: "06",
        img: "/reference/953204bb4ef6ae03.jpg",
        date: "Nov 20 · Fri",
        tag: "Next-Gen AI",
        hl: "An AI necklace, a lifelogging wearable, and AI-driven characters.",
        title: "Emerging AI Devices",
        body: "Odyss Life on a necklace that reads eating behaviour, Looki AI on a multimodal device that sees and hears, and WAKUART on AI-driven characters and IP — closing with a shared founder showcase.",
        badges: ["Odyss Life", "Looki AI", "WAKUART"],
      },
      {
        n: "07",
        img: "/reference/7d2d673461319153.jpg",
        date: "Nov 21 · Sat",
        tag: "Closing",
        hl: "Reflect on the products and connections worth continuing.",
        title: "Closing & Next Steps",
        body: "A flexible morning for follow-up meetings, then a closing session looking back at the week's sourcing, product, and investment threads worth carrying forward.",
        badges: ["Closing"],
      },
    ],
    chipDayMap: {
      "Smart Hardware": 0,
      "AI Wearables": 3,
      Crowdfunding: 1,
      "Supply Chains": 2,
      "Tech Retail": 4,
      "Global Expansion": 4,
    },
    companies: [
      {
        name: "DJI",
        description:
          "Turning hard engineering into trusted drones and camera tech.",
        image: "/reference/a539a046c86be70f.png",
        imageAlt: "DJI logo",
        rotation: "-4deg",
      },
      {
        name: "Anker Innovations",
        description:
          "200M+ consumers across 140 countries, built from Shenzhen.",
        image: "/reference/93e61b76ff254f8e.png",
        imageAlt: "Anker Innovations logo",
        rotation: "3deg",
      },
      {
        name: "UGREEN",
        description:
          "From charging accessories to a 300M-user product ecosystem.",
        image: "/reference/0b4ce8b29fb12a33.png",
        imageAlt: "UGREEN logo",
        rotation: "-2deg",
      },
      {
        name: "Rokid",
        description:
          "AI glasses betting that eyewear is the next computing platform.",
        image: "/reference/ab60be6bc6f02e64.png",
        imageAlt: "Rokid logo",
        rotation: "5deg",
        darkLogo: true,
      },
      {
        name: "SHARGE",
        description:
          "Design-led charging hardware, built for global crowdfunding.",
        image: "/reference/276210e92f8ac6db.png",
        imageAlt: "SHARGE logo",
        rotation: "-3deg",
      },
    ],
    marquee: ["Vocci", "Z·Pilot", "Odyss Life", "Looki AI", "WAKUART"],
    companyNote:
      "Placeholder logos shown — swap in real company photos anytime.",
    gain: {
      title: ["Judgment, Not", "Just a Shopping List"],
      lead: [
        {
          text: "By week's end you'll have",
          emphasis: false,
        },
        {
          text: "a working map",
          emphasis: true,
        },
        {
          text: "of China's hardware and AI-wearable ecosystem — not a bag of samples.",
          emphasis: false,
        },
      ],
      image: {
        src: "/reference/22b66269477f333d.jpg",
        alt: "Cohort in the Field",
        label: "Cohort in the Field",
        rotation: "0deg",
      },
      items: [
        {
          title: "See the hardware ecosystem fit together",
          body: "Component markets, product teams, factories, and retail — how they connect.",
        },
        {
          title: "Build real judgment",
          body: "What actually makes a product deployable: form factor, battery life, and after-sales support.",
        },
        {
          title: "Leave with live connections",
          body: "Sourcing relationships, partnerships, and intros — carried forward after the week ends.",
        },
      ],
      chips: [
        "Smart Hardware",
        "AI Wearables",
        "Crowdfunding",
        "Supply Chains",
        "Tech Retail",
        "Global Expansion",
      ],
    },
    guests: [
      {
        initials: "BZ",
        name: "Bo Zhang",
        roles: ["Founder", "SHARGE"],
        description:
          "Founded SHARGE, known for design-led charging hardware built for global crowdfunding.",
        rotation: "-3deg",
      },
      {
        initials: "QZ",
        name: "Qingsen Zhang",
        roles: ["Co-Founder & Chairman", "UGREEN"],
        description:
          "Co-founded UGREEN, scaling it into a 300M-user consumer electronics ecosystem.",
        rotation: "2deg",
      },
    ],
    logistics: [
      {
        title: "Shenzhen + Shanghai Bases",
        body: "Shared accommodation is included in both cities. Staying with the group is where the real connections happen — over meals, transport, and evenings.",
        image: {
          src: "/reference/342f3eb92ccf8840.jpg",
          alt: "Shared Housing",
          label: "Shared Housing",
          rotation: "0deg",
        },
      },
      {
        title: "Transport & Language",
        body: "Airport transfers, local transport, and Chinese–English interpretation throughout. Shenzhen-to-Shanghai travel confirmed closer to the date.",
        image: {
          src: "/reference/232ebb8c37e4774c.jpg",
          alt: "On the Road",
          label: "On the Road",
          rotation: "0deg",
        },
      },
    ],
    footerRows: [
      [
        {
          href: "/",
          text: "← Full three-week program",
        },
        {
          href: "mailto:business@globalpropeller.com",
          text: "business@globalpropeller.com",
        },
        {
          href: "/week2",
          text: "Week 2 →",
        },
      ],
      [
        {
          href: "/week2",
          text: "← Week 2 — Embodied AI & Humanoid Robots",
        },
        {
          href: "/",
          text: "Back to full program →",
        },
      ],
    ],
  },
} as const satisfies Record<WeekPageId, WeekPageData>;
