/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "d2gzwh8fr2ff6c.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
