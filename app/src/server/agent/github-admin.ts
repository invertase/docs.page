export function parseRepo(repo: string) {
  const [owner, name, ...rest] = repo.split("/");

  if (!owner || !name || rest.length > 0) {
    return null;
  }

  return {
    owner,
    repo: name,
  };
}

export async function checkAdminAccess({
  owner,
  repo,
  githubToken,
}: {
  owner: string;
  repo: string;
  githubToken: string;
}) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "docs.page",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );

  const payload = (await response.json().catch(() => null)) as unknown;

  if (response.status === 401) {
    return {
      ok: false as const,
      status: 401,
      error: "The provided GitHub token is invalid or expired.",
    };
  }

  if (response.status === 404) {
    return {
      ok: false as const,
      status: 404,
      error:
        "Unable to find that repository or access it with the provided GitHub token.",
    };
  }

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      error: "Unable to verify GitHub repository permissions.",
    };
  }

  const isAdmin =
    isRecord(payload) &&
    isRecord(payload.permissions) &&
    payload.permissions.admin === true;

  if (!isAdmin) {
    return {
      ok: false as const,
      status: 403,
      error:
        "You are not an admin of this repository on GitHub. Ask an admin to create the agent, or use a GitHub token with admin access.",
    };
  }

  return {
    ok: true as const,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
