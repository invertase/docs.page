import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { trackPageRequest } from "./plausible";
import { getEnvironment } from "./env";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const url = new URL(request.url);

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
  // return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/:org/:repo/:slug*"],
};
