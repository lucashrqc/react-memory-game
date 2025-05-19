import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/react-memory-game",
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
    unoptimized: true,
  },
};

export default nextConfig;
