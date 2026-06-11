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
          950: "#060d0a",
          900: "#091410",
          800: "#0d1f18",
          700: "#122b20",
          600: "#1a3d2e",
          500: "#245240",
        },
        electric: {
          400: "#33ffaa",
          500: "#00ff87",
          600: "#00d96e",
          700: "#00a852",
        },
        gold: {
          300: "#ffe082",
          400: "#ffd740",
          500: "#ffca28",
          600: "#ffb300",
        },
        ember: {
          400: "#ff9a3c",
          500: "#ff7a00",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
        },
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "'Fira Mono'", "monospace"],
      },
      backgroundImage: {
        "net": "repeating-linear-gradient(0deg,transparent,transparent 11px,rgba(0,255,135,0.04) 11px,rgba(0,255,135,0.04) 12px),repeating-linear-gradient(90deg,transparent,transparent 11px,rgba(0,255,135,0.04) 11px,rgba(0,255,135,0.04) 12px)",
        "pitch-lines": "repeating-linear-gradient(0deg,transparent,transparent 47px,rgba(255,255,255,0.02) 47px,rgba(255,255,255,0.02) 48px)",
        "glow-electric": "radial-gradient(ellipse at 50% 0%,rgba(0,255,135,0.12) 0%,transparent 70%)",
        "glow-gold": "radial-gradient(ellipse at 50% 0%,rgba(255,202,40,0.15) 0%,transparent 65%)",
      },
      keyframes: {
        "badge-pop": {
          "0%":   { transform: "scale(0.5)", opacity: "0" },
          "70%":  { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)",   opacity: "1" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        "pulse-ring": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(0,255,135,0.4)" },
          "50%":     { boxShadow: "0 0 0 6px rgba(0,255,135,0)" },
        },
      },
      animation: {
        "badge-pop":  "badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        "fade-up":    "fade-up 0.4s ease both",
        "shimmer":    "shimmer 2.5s linear infinite",
        "pulse-ring": "pulse-ring 1.8s ease-in-out infinite",
      },
      boxShadow: {
        "electric": "0 0 20px rgba(0,255,135,0.25), 0 0 60px rgba(0,255,135,0.08)",
        "gold":     "0 0 20px rgba(255,202,40,0.3),  0 0 60px rgba(255,202,40,0.1)",
        "card":     "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,135,0.15)",
      },
    },
  },
  plugins: [],
}