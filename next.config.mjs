/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dnc1r1c8fuurq.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
