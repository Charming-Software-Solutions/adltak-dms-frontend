/** @type {import('next').NextConfig} */
const nextConfig = {
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
