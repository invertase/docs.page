import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/schema.json",
          destination: "/api/schema.json",
        },
        {
          source: "/:owner/:repo/search.json",
          destination: "/api/:owner/:repo/search.json",
        },
        {
          source: "/:owner/:repo/sitemap.xml",
          destination: "/api/:owner/:repo/sitemap.xml",
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
