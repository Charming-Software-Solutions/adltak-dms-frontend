/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
