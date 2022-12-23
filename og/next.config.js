/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites() {
    return [
      {
        source: '/',
        destination: '/api/og',
      },
    ];
  },
};

module.exports = nextConfig;
