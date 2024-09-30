import type { NextRequest } from "next/server";

export async function trackPageRequest(
  request: NextRequest,
  owner: string,
  repository: string
): Promise<void> {
  try {
    await fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("User-Agent") ?? "",
        "X-Forwarded-For": request.headers.get("X-Forwarded-For") ?? "",
      }),
      body: JSON.stringify({
        name: "pageview",
        url: request.url,
        domain: "docs.page",
        props: {
          owner: owner.toLowerCase(),
          repository: `${owner}/${repository}`.toLowerCase(),
        },
      }),
    });
  } catch (e) {
    console.error("Failed to track page request", e);
  }
}
