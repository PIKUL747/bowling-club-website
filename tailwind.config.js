/** @type {import('tailwindcss').Config} */
module.exports = {
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
    },
  },
  plugins: [],
};