import localFont from "next/font/local";
import { Noto_Sans_Bengali } from "next/font/google";

// SolaimanLipi — Primary Bangla font
// Loaded locally for performance and offline reliability
export const solaimanLipi = localFont({
  src: "../fonts/SolaimanLipi.ttf",
  variable: "--font-bangla",
  display: "swap",       // Prevents invisible text during load
  preload: true,         // Prioritized — this is the primary font
  fallback: ["Noto Sans Bengali", "sans-serif"],
  weight: "400",
});

// Noto Sans Bengali — Fallback Bangla font
// Loaded from Google Fonts with Next.js optimization
export const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bangla-fallback",
  display: "swap",
  preload: false,        // Secondary — not preloaded to save bandwidth
  weight: ["400", "600", "700"],
});