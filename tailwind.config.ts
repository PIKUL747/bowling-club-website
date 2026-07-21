import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1120",
        "navy-light": "#111A2E",
        orange: "#FF6B35",
        cyan: "#22D3EE",
        bone: "#F4F1EA",
        steel: "#8B95A8",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "lane-stripe":
          "repeating-linear-gradient(90deg, rgba(244,241,234,0.06) 0px, rgba(244,241,234,0.06) 2px, transparent 2px, transparent 14px)",
      },
    },
  },
  plugins: [],
};

export default config;
