import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f5f1e8",
        ivory: "#f5f1e8",
        ink: "#1a1a1a",
        "ink-soft": "#6b6455",
        navy: "#1b3a6b",
        bridge: "#1b3a6b",
        sun: "#e8a317",
        marigold: "#e8a317",
        "sun-soft": "#f2c04d",
        cloud: "#fbf8f0",
        card: "#fbf8f0",
        line: "rgba(26, 26, 26, 0.15)",
      },
      fontFamily: {
        poster: ['"Fraunces"', "Georgia", "serif"],
        serif: ['"Fraunces"', "Georgia", '"Times New Roman"', "serif"],
        mono: ['"IBM Plex Mono"', '"SFMono-Regular"', "Consolas", "monospace"],
        sans: ['"Inter"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      boxShadow: {
        ink: "6px 6px 0 0 #1a1a1a",
        ticket: "6px 6px 0 0 #1a1a1a",
      },
    },
  },
  plugins: [],
};

export default config;
