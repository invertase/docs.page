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
const ATTRIBUTE_REGEX =
  /([:@A-Za-z_][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

export function normalizeCustomTags(
  markdown: string,
  componentNames: Iterable<string>,
): string {
  const knownComponents = new Set(
    Array.from(componentNames, (name) => name.toLowerCase()),
  );

  return markdown.replace(
    /<(\/?)([A-Za-z][A-Za-z0-9-]*)([^>]*)>/g,
    (_full, slash: string, rawName: string, rawAttributes: string) => {
      const isClosing = slash === "/";
      const isSelfClosing = /\/\s*$/.test(rawAttributes);
      const normalizedName = rawName.toLowerCase();
      const isKnownComponent = knownComponents.has(normalizedName);
      const isCustomLike = /^[A-Z]/.test(rawName) || isKnownComponent;

      if (!isCustomLike) {
        return `<${slash}${rawName}${rawAttributes}>`;
      }

      if (isClosing) {
        return "</div>";
      }

      const attributes = parseTagAttributes(rawAttributes);
      const encodedAttributes =
        Object.keys(attributes).length > 0
          ? ` data-props="${escapeAttributeValue(encodeURIComponent(JSON.stringify(attributes)))}"`
          : "";
      const componentName = isKnownComponent
        ? normalizedName
        : "unknown-component";
      const dataNamePart = isKnownComponent
        ? ""
        : ` data-name="${escapeAttributeValue(rawName)}"`;
      const openTag = `<div data-component="${componentName}"${dataNamePart}${encodedAttributes}>`;

      return isSelfClosing ? `${openTag}</div>` : openTag;
    },
  );
}

export function decodeComponentProps(
  encodedValue: string | undefined,
): Record<string, string | boolean> {
  if (!encodedValue) {
    return {};
  }

  try {
    const decoded = decodeURIComponent(encodedValue);
    const parsed = JSON.parse(decoded);
    return isStringRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

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
  let activeFence: string | null = null;

  for (const line of lines) {
    const fence = /^\s{0,3}(```+|~~~+)/.exec(line);
    if (fence) {
      const fenceToken = fence[1];
      if (!fenceToken) {
        continue;
      }

      const marker = fenceToken[0] ?? null;
      if (marker === null) {
        continue;
      }

      if (activeFence === null) {
        activeFence = marker;
      } else if (activeFence === marker) {
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

function parseTagAttributes(rawAttributes: string): Record<string, string | boolean> {
  const attributes: Record<string, string | boolean> = {};
  const cleaned = rawAttributes.replace(/\/\s*$/, "");
  let match: RegExpExecArray | null;

  ATTRIBUTE_REGEX.lastIndex = 0;

  // biome-ignore lint/suspicious/noAssignInExpressions: iterative regex parsing is intended here.
  while ((match = ATTRIBUTE_REGEX.exec(cleaned)) !== null) {
    const [, name, doubleQuoted, singleQuoted, bareValue] = match;
    if (!name) {
      continue;
    }

    attributes[name] = doubleQuoted ?? singleQuoted ?? bareValue ?? true;
  }

  return attributes;
}

function slugifyHeading(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return slug || "section";
}

function escapeAttributeValue(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function isStringRecord(
  value: unknown,
): value is Record<string, string | boolean> {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.values(value).every(
    (entry) => typeof entry === "string" || typeof entry === "boolean",
  );
}
