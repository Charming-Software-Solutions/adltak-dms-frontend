import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d33q9oo2xmir6r.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
