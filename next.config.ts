import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/calendrier-la-belle-electrique',
  assetPrefix: '/calendrier-la-belle-electrique/',
  trailingSlash: true,
};

export default nextConfig;
