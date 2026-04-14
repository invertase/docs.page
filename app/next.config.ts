import type { NextConfig } from "next";
import path from "node:path";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  ...(isProduction
    ? {
        /** ISR / `unstable_cache` / fetch cache — `@neshca/cache-handler` (see `cache-handler.cjs`). */
        cacheHandler: path.join(process.cwd(), "cache-handler.cjs"),
        outputFileTracingIncludes: {
          "/*": ["./cache-handler.cjs"],
        },
      }
    : {}),
};

export default nextConfig;
