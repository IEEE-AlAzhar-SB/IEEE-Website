export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  // The hero animate-* classes are applied via runtime className strings
  // (see src/service/homeHeroSecion.ts), which Tailwind's JIT scanner
  // cannot see — safelist the exact names so the CSS survives the build.
  safelist: [
    "animate-hero-1",
    "animate-hero-2",
    "animate-hero-3",
    "animate-bg-bubble-1",
    "animate-bg-bubble-2",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
      },
      keyframes: {
        "hero-float-1": {
          "0%, 100%": { transform: "translateX(-50%) translateY(0px) scale(1)" },
          "50%": { transform: "translateX(-50%) translateY(-12px) scale(1.02)" },
        },
        "hero-float-2": {
          "0%, 100%": { transform: "translateX(-50%) translateY(0px) scale(1)" },
          "50%": { transform: "translateX(-50%) translateY(12px) scale(0.98)" },
        },
        "hero-float-3": {
          "0%, 100%": { transform: "translateX(0px) translateY(-50%)" },
          "50%": { transform: "translateX(10px) translateY(calc(-50% - 8px))" },
        },
        "bg-bubble-1": {
          "0%, 100%": { transform: "translateY(0px) rotate(43.61deg)" },
          "50%": { transform: "translateY(-20px) rotate(45deg)" },
        },
        "bg-bubble-2": {
          "0%, 100%": { transform: "translateY(0px) rotate(151.52deg)" },
          "50%": { transform: "translateY(20px) rotate(149deg)" },
        },
      },
      animation: {
        "hero-1": "hero-float-1 5s ease-in-out infinite",
        "hero-2": "hero-float-2 6s ease-in-out infinite",
        "hero-3": "hero-float-3 7s ease-in-out infinite",
        "bg-bubble-1": "bg-bubble-1 9s ease-in-out infinite",
        "bg-bubble-2": "bg-bubble-2 11s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
