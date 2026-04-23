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

  return mapMarkdownOutsideFences(markdown, (segment) => {
    const normalizedTags = segment.replace(
      /<(\/?)([A-Za-z][A-Za-z0-9-]*)([^>]*)>/g,
      (_full, slash: string, rawName: string, rawAttributes: string) => {
        const normalizedName = rawName.toLowerCase();
        const isKnownComponent = knownComponents.has(normalizedName);

        if (isKnownComponent) {
          return `<${slash}${normalizedName}${rawAttributes}>`;
        }

        if (slash === "/") {
          return "</unknown>";
        }

        return `<unknown data-name="${escapeAttributeValue(rawName)}"${rawAttributes}>`;
      },
    );

    return expandInlineKnownComponents(normalizedTags, knownComponents);
  });
}

function mapMarkdownOutsideFences(
  markdown: string,
  transform: (segment: string) => string,
): string {
  const lines = markdown.split(/\r?\n/);
  const output: string[] = [];
  let activeFence: string | null = null;
  let segmentStart = 0;

  const flushSegment = (segmentEnd: number) => {
    if (segmentEnd <= segmentStart) {
      return;
    }
    output.push(transform(lines.slice(segmentStart, segmentEnd).join("\n")));
  };

  lines.forEach((line, index) => {
    const fence = /^\s{0,3}(```+|~~~+)/.exec(line);
    if (!fence) {
      return;
    }

    const marker = fence[1]?.[0];
    if (!marker) {
      return;
    }

    if (activeFence === null) {
      flushSegment(index);
      activeFence = marker;
      output.push(line);
      segmentStart = index + 1;
      return;
    }

    if (activeFence === marker) {
      output.push(lines.slice(segmentStart, index).join("\n"));
      output.push(line);
      activeFence = null;
      segmentStart = index + 1;
    }
  });

  if (segmentStart < lines.length) {
    if (activeFence === null) {
      flushSegment(lines.length);
    } else {
      output.push(lines.slice(segmentStart).join("\n"));
    }
  } else if (markdown.endsWith("\n")) {
    output.push("");
  }

  return output.join("\n");
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

type CustomComponentNode = {
  properties?: {
    dataComponent?: unknown;
    dataProps?: unknown;
  };
};

export function getCustomComponentName(
  node: CustomComponentNode | undefined,
): string | null {
  const componentName = node?.properties?.dataComponent;
  return typeof componentName === "string" ? componentName : null;
}

export function getCustomComponentProps(
  node: CustomComponentNode | undefined,
  expectedComponentName?: string,
): Record<string, string | boolean> | null {
  const componentName = getCustomComponentName(node);
  if (!componentName) {
    return null;
  }

  if (expectedComponentName && componentName !== expectedComponentName) {
    return null;
  }

  const encodedProps = node?.properties?.dataProps;
  return decodeComponentProps(
    typeof encodedProps === "string" ? encodedProps : undefined,
  );
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

function expandInlineKnownComponents(
  markdown: string,
  knownComponents: Set<string>,
): string {
  if (knownComponents.size === 0) {
    return markdown;
  }

  const knownComponentsPattern = Array.from(knownComponents, escapeRegex)
    .sort((a, b) => b.length - a.length)
    .join("|");
  const inlineComponentPattern = new RegExp(
    `<(${knownComponentsPattern})(\\s[^>]*)?>([^\\n]*?)<\\/\\1>`,
    "g",
  );

  return markdown.replace(
    inlineComponentPattern,
    (_full, tag: string, attributes: string | undefined, content: string) =>
      `<${tag}${attributes ?? ""}>\n${content}\n</${tag}>`,
  );
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

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
