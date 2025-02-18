/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-api-domain.com', // Replace with the actual API domain
      },
    ],
  },
};
module.exports = nextConfig;
