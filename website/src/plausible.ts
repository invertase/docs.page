import type { GetServerSidePropsContext } from "next";
import { getClientIp } from "request-ip";

export async function trackPageRequest(
  request: GetServerSidePropsContext["req"],
  owner: string,
  repository: string,
): Promise<void> {
  const userAgent = request.headers["User-Agent"];

  try {
    await fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "User-Agent": Array.isArray(userAgent)
          ? userAgent.join(" ")
          : userAgent || "",
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
