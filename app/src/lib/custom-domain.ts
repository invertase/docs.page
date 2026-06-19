export async function getCustomDomain(
  owner: string,
  repository: string,
): Promise<string | null> {
  const response = await fetch(
    `https://custom-domain.invertase.workers.dev/?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repository)}`,
  );

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as { domain?: unknown };

  return typeof json.domain === "string" ? json.domain : null;
}
