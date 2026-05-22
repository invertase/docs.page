import { getSitemapPathname } from "@/lib/docs-paths";
import type { ResolvedDocsRoute } from "@/lib/docs-routing";

export function buildDocsRepoRobotsTxt(args: {
  route: ResolvedDocsRoute;
  origin: string;
  noindex: boolean;
}): string {
  const { route, origin, noindex } = args;
  const lines = ["User-agent: *"];

  if (noindex) {
    lines.push("Disallow: /");
  } else {
    lines.push("Allow: /");
    lines.push("");
    const sitemapPath = getSitemapPathname(route);
    lines.push(`Sitemap: ${origin}${sitemapPath}`);
  }

  return `${lines.join("\n")}\n`;
}
