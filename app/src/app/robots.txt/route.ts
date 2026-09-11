import { ROOT_ROBOTS_TXT_CACHE_HEADERS, setDocsCacheHeaders } from "@/proxy";

// Root-domain crawl policy. Per-repo sites get a generated robots.txt at
// /{owner}/{repo}/robots.txt; this covers the docs.page root domain itself
// (homepage + root discovery files). All crawlers — including AI crawlers —
// are intentionally allowed.
const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://docs.page/sitemap.xml
`;

export function GET() {
  const response = new Response(ROBOTS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
  setDocsCacheHeaders(response.headers, ROOT_ROBOTS_TXT_CACHE_HEADERS);
  return response;
}
