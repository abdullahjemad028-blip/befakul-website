import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables strict SSR — good for SEO
  reactStrictMode: true,

  // Bangla + English language support
  // (routing-level i18n removed in App Router, handled in layout)

  // Allow images from these domains later
  images: {
    domains: [],
  },
};

export default nextConfig;