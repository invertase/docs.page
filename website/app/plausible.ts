import { getClientIp } from "request-ip";

export async function trackPageRequest(
  request: Request,
  owner: string,
  repository: string
): Promise<void> {
  try {
    await fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("User-Agent") || "",
        // @ts-expect-error - request-ip types use none-generic Request
        "X-Forwarded-For": getClientIp(request) ?? "",
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
