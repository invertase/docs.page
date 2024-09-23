import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
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
