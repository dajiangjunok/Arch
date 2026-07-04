import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f2ebdc",
        ink: "#082747",
        "ink-soft": "#214767",
        bridge: "#06315c",
        sun: "#eca90b",
        "sun-soft": "#f6c43b",
        cloud: "#f8f4ea",
        line: "#cbbd9d",
      },
      fontFamily: {
        poster: ['"Arial Narrow"', '"Helvetica Neue Condensed"', "Impact", "sans-serif"],
        serif: ["Georgia", '"Times New Roman"', "serif"],
        mono: ['"IBM Plex Mono"', '"SFMono-Regular"', "Consolas", "monospace"],
        sans: ['"Inter"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      boxShadow: {
        ticket: "0 28px 80px rgba(8, 39, 71, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
