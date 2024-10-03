import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { trackPageRequest } from "./plausible";
import { getEnvironment } from "./env";

// https://regex101.com/r/RMw0Ib/1
const BLOCK_LIST_REGEX =
  /^\/(wp-admin|\.well-known|wp-login\.php|wp-logout\.php|xmlrpc\.php|wp-content|wp-includes|wp-json|cgi-bin|\.env|administrator|admin|user|login|logout|register|signup|signin|dashboard|config|system|vendor|installation|magento|downloader|artisan|shell\.php|upload\.php|test\.php|phpinfo\.php|config\.php|configuration\.php|database\.sql|backup\.sql|db_backup|\.git|\.svn|\.hg|\.bzr|\.DS_Store|\.htaccess|\.htpasswd)(\/|$)/i;

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (BLOCK_LIST_REGEX.test(url.pathname)) {
    return new Response(
      "This request has been blocked due to security reasons. Please create an issue at https://github.com/invertase/docs.page if you think is incorrect.",
      { status: 403 }
    );
  }

  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/_docs.page") ||
    url.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const [owner, repository] = url.pathname.split("/").filter(Boolean);

  if (getEnvironment() === "production") {
    waitUntil(trackPageRequest(request, owner, repository));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/:org/:repo/:slug*"],
};
