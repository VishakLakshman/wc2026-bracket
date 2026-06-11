/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#050f0a",
          900: "#0a1f14",
          800: "#0f2e1d",
          700: "#164026",
        },
        gold: {
          400: "#f5c842",
          500: "#e6b820",
          600: "#c49a10",
        },
        grass: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}