import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // In dev, avoid serving stale optimized PNGs after replacing files in `public/`.
    minimumCacheTTL: process.env.NODE_ENV === "development" ? 0 : undefined,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    // Allow transpiling TypeScript from an external package
    config.module.rules.push({
      test: /\.ts$/,
      include: [path.resolve(process.cwd(), "../packages/cli")],
      use: {
        loader: "ts-loader",
        options: {
          transpileOnly: true, // For faster compilation, but optional
        },
      },
    });

    return config;
  },
  rewrites() {
    return [
      {
        source: "/schema.json",
        destination: "https://staging-api.docs.page/schema.json",
      },
    ];
  },
};

export default nextConfig;
