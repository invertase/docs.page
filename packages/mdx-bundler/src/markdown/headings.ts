export type HeadingNode = {
  id: string;
  title: string;
  rank: number | null;
  includeInToc: boolean;
};

type ExtractHeadingNodesOptions = {
  tocMinDepth?: number;
  tocMaxDepth?: number;
};

const DEFAULT_TOC_MIN_DEPTH = 2;
const DEFAULT_TOC_MAX_DEPTH = 3;

export function extractHeadingNodes(
  markdown: string,
  options: ExtractHeadingNodesOptions = {},
): HeadingNode[] {
  const tocMinDepth = options.tocMinDepth ?? DEFAULT_TOC_MIN_DEPTH;
  const tocMaxDepth = options.tocMaxDepth ?? DEFAULT_TOC_MAX_DEPTH;

  if (tocMaxDepth < tocMinDepth || tocMaxDepth < 1) {
    return [];
  }

  const slugCounts = new Map<string, number>();
  const headings: HeadingNode[] = [];
  const lines = markdown.split(/\r?\n/);
  let activeFence: { marker: string; length: number } | null = null;

  for (const line of lines) {
    const fence = getFenceRun(line);
    if (fence) {
      if (activeFence === null) {
        activeFence = fence;
      } else if (
        activeFence.marker === fence.marker &&
        fence.length >= activeFence.length
      ) {
        activeFence = null;
      }

      continue;
    }

    if (activeFence !== null) {
      continue;
    }

    const match = /^\s{0,3}(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!match) {
      continue;
    }

    const hashes = match[1];
    const rawTitle = match[2];
    if (!hashes || !rawTitle) {
      continue;
    }

    const rank = hashes.length;
    const title = rawTitle.replace(/\s+#+\s*$/, "").trim();
    if (!title) {
      continue;
    }

    const baseSlug = slugifyHeading(title);
    const duplicateCount = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, duplicateCount + 1);

    headings.push({
      id: duplicateCount === 0 ? baseSlug : `${baseSlug}-${duplicateCount}`,
      title,
      rank,
      includeInToc: rank >= tocMinDepth && rank <= tocMaxDepth,
    });
  }

  return headings;
}

function getFenceRun(line: string): { marker: string; length: number } | null {
  const match = /^\s*(`{3,}|~{3,})/.exec(line);
  const token = match?.[1];
  if (!token) {
    return null;
  }

  const marker = token[0];
  if (!marker) {
    return null;
  }

  return { marker, length: token.length };
}

function slugifyHeading(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return slug || "section";
}
