import type { Config } from "tailwindcss";

const config: Config = {
  // Only scan these files — keeps CSS bundle small
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Bangla font — we'll load it in globals.css
      fontFamily: {
        bangla: ["SolaimanLipi", "Noto Sans Bengali", "sans-serif"],
      },
      // Befakul brand colors — adjust if you have official colors
      colors: {
        primary: {
          DEFAULT: "#006633", // Islamic green
          light: "#008c44",
          dark: "#004d26",
        },
        accent: {
          DEFAULT: "#d4a017", // Gold
        },
      },
    },
  },
  plugins: [],
};

export default config;