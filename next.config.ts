import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        "pharmroo.com",
        "www.pharmroo.com",
        "pharmroo-five.vercel.app",
        "*.vercel.app",
      ],
    },
  },
};

export default nextConfig;
