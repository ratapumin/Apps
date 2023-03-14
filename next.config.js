/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.psu.ac.th",
      },
    ],
  },
};

module.exports = nextConfig;
