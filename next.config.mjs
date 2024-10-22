/** @type {import('next').NextConfig} */
const nextConfig = {
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
