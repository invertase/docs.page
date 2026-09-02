import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  devIndicators: false,
  transpilePackages: ["@docs.page/mdx-bundler"],
  turbopack: {
    rules: {
      "*.wgsl": {
        loaders: ["@vgpu/wgsl/loader-webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module ??= {};
    config.module.rules ??= [];
    config.module.rules.push({
      test: /\.wgsl$/,
      loader: "@vgpu/wgsl/loader-webpack",
    });
    return config;
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:owner/:repo/search.json",
          destination: "/api/:owner/:repo/search.json",
        },
        {
          source: "/:owner/:repo/llms.txt",
          destination: "/api/:owner/:repo/llms.txt",
        },
        {
          source: "/:owner/:repo/llms-full.txt",
          destination: "/api/:owner/:repo/llms-full.txt",
        },
        {
          source: "/:owner/:repo/sitemap.xml",
          destination: "/api/:owner/:repo/sitemap.xml",
        },
        {
          source: "/:owner/:repo/robots.txt",
          destination: "/api/:owner/:repo/robots.txt",
        },
        {
          source: "/:owner/:repo/mcp",
          destination: "/api/:owner/:repo/mcp",
        },
      ],
    };
  },
};

export default nextConfig;
