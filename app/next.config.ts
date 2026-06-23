import type { NextConfig } from "next";
/** Paths whose responses are CDN-cacheable; override App Router RSC `Vary` values. */
const CDN_CACHEABLE_API_SOURCES = [
  "/api/bundle",
  "/api/:owner/:repo/search.json",
  "/api/:owner/:repo/sitemap.xml",
  "/api/:owner/:repo/robots.txt",
  "/api/:owner/:repo/llms.txt",
  "/api/:owner/:repo/llms-full.txt",
] as const;

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  devIndicators: false,
  transpilePackages: ["@docs.page/mdx-bundler"],
  async headers() {
    return CDN_CACHEABLE_API_SOURCES.map((source) => ({
      source,
      headers: [{ key: "Vary", value: "Accept-Encoding" }],
    }));
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
