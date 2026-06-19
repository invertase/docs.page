export function buildDocsRepoRobotsTxt(args: {
  sitemapUrl: string;
  noindex: boolean;
}): string {
  const { sitemapUrl, noindex } = args;
  const lines = ["User-agent: *"];

  if (noindex) {
    lines.push("Disallow: /");
  } else {
    lines.push("Allow: /");
    lines.push("");
    lines.push(`Sitemap: ${sitemapUrl}`);
  }

  return `${lines.join("\n")}\n`;
}
