import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // ESLint warnings build block করবে না
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript errors build block করবে না
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;