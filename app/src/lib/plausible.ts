import type { NextRequest } from "next/server";

import { parseRepositorySegment } from "@/lib/docs-routing";

export async function trackPageRequest(
  request: NextRequest,
  owner: string,
  repository: string,
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
  } catch (error) {
    console.error("Failed to track page request", error);
  }
}

export function resolvePlausibleOwnerRepo(
  pathname: string,
  options: {
    vanityOwner: string | null;
    vanityDomain: boolean;
  },
): { owner: string; repository: string } | null {
  const segments = pathname.split("/").filter(Boolean);

  if (options.vanityDomain) {
    const owner = options.vanityOwner ?? segments[0];
    if (!owner) {
      return null;
    }

    if (segments[0] === owner && segments.length >= 2) {
      const { repository } = parseRepositorySegment(segments[1]);
      return { owner, repository };
    }

    if (segments.length >= 1) {
      const { repository } = parseRepositorySegment(segments[0]);
      return { owner, repository };
    }

    return null;
  }

  if (segments.length < 2) {
    return null;
  }

  const { repository } = parseRepositorySegment(segments[1]);
  return { owner: segments[0], repository };
}
