import type { ComponentProps } from "react";
import { defaultRehypePlugins, type Streamdown } from "streamdown";

type AllowedTagsInput = Record<string, readonly string[]>;
type RehypePlugins = NonNullable<ComponentProps<typeof Streamdown>["rehypePlugins"]>;
type HastNode = {
  type: string;
  children?: Array<HastNode | undefined>;
  value?: string;
  tagName?: string;
};
type SanitizeSchema = {
  tagNames?: string[];
  attributes?: Record<string, string[]>;
} & Record<string, unknown>;

const UNKNOWN_COMPONENT_TAG = "unknown";
const CUSTOM_TAG_REGEX = /<(\/?)([A-Za-z][A-Za-z0-9-]*)([^>]*)>/g;

/**
 * HTML lowercases tag names. A hyphenated custom tag like `you-tube` often
 * appears in HAST as the same letters run together (`youtube`) when the
 * author wrote PascalCase (`<YouTube>`) and it did not go through our raw
 * string normalizer first. Build `youtube` → `you-tube` (and similar) from
 * allowlisted tag names so we do not hand-maintain per-component aliases.
 */
function collapsedHyphenTagAliases(
  canonicalTagNames: readonly string[],
): Record<string, string> {
  const aliases: Record<string, string> = {};
  for (const canonical of canonicalTagNames) {
    if (!canonical.includes("-")) {
      continue;
    }
    const collapsed = canonical.replace(/-/g, "");
    if (!collapsed) {
      continue;
    }
    const prior = aliases[collapsed];
    if (prior !== undefined && prior !== canonical) {
      continue;
    }
    aliases[collapsed] = canonical;
  }
  return aliases;
}

function toSanitizeAllowedTags(tags: AllowedTagsInput): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const [tag, attrs] of Object.entries(tags)) {
    result[tag] = [...attrs];
  }
  return result;
}

/** Rehype plugins for markdown that uses fenced custom tags merged with Streamdown defaults. */
export function createDocsPageRehypePlugins(
  allowedTags: AllowedTagsInput,
): RehypePlugins {
  const sanitizeAttrs = toSanitizeAllowedTags(allowedTags);
  const knownComponents = new Set(Object.keys(sanitizeAttrs).map((tag) => tag.toLowerCase()));
  const customBlockTags = new Set([...knownComponents, UNKNOWN_COMPONENT_TAG]);
  const sanitizePlugin = Array.isArray(defaultRehypePlugins.sanitize)
    ? defaultRehypePlugins.sanitize[0]
    : defaultRehypePlugins.sanitize;
  const sanitizeSchema = (
    Array.isArray(defaultRehypePlugins.sanitize)
      ? defaultRehypePlugins.sanitize[1]
      : {}
  ) as SanitizeSchema;

  const sanitizeEntry = [
    sanitizePlugin as RehypePlugins[number],
    {
      ...sanitizeSchema,
      tagNames: Array.from(
        new Set([...(sanitizeSchema.tagNames ?? []), ...Object.keys(sanitizeAttrs)]),
      ),
      attributes: {
        ...(sanitizeSchema.attributes ?? {}),
        ...sanitizeAttrs,
      },
    },
  ] as RehypePlugins[number];

  const tagAliases = collapsedHyphenTagAliases(Object.keys(sanitizeAttrs));

  return [
    createNormalizeCustomTagsPlugin(knownComponents),
    defaultRehypePlugins.raw,
    createCoerceHastTagNamesPlugin(tagAliases),
    sanitizeEntry,
    defaultRehypePlugins.harden,
    createUnwrapCustomBlockParagraphsPlugin(customBlockTags),
  ];
}

function createCoerceHastTagNamesPlugin(aliases: Record<string, string>) {
  return () => {
    return (tree: HastNode | undefined) => {
      if (!tree) {
        return;
      }

      visitNodes(tree, (node) => {
        if (node.type !== "element" || typeof node.tagName !== "string") {
          return;
        }

        const canonical = aliases[node.tagName];
        if (canonical) {
          node.tagName = canonical;
        }
      });
    };
  };
}

function createNormalizeCustomTagsPlugin(knownComponents: Set<string>) {
  return () => {
    return (tree: HastNode | undefined) => {
      if (!tree) {
        return;
      }

      visitNodes(tree, (node) => {
        if (node.type !== "raw" || typeof node.value !== "string") {
          return;
        }

        node.value = node.value.replace(
          CUSTOM_TAG_REGEX,
          (_full, slash: string, rawName: string, rawAttributes: string) => {
            const tagKey = canonicalCustomTagName(rawName);
            const isKnownComponent = knownComponents.has(tagKey);
            const isCustomLike = /^[A-Z]/.test(rawName) || isKnownComponent;
            const isSelfClosing = /\/\s*$/.test(rawAttributes);
            const attributes = isSelfClosing
              ? rawAttributes.replace(/\/\s*$/, "")
              : rawAttributes;

            if (!isCustomLike) {
              return `<${slash}${rawName}${rawAttributes}>`;
            }

            if (isKnownComponent) {
              if (slash === "/") {
                return `</${tagKey}>`;
              }

              const openTag = `<${tagKey}${attributes}>`;
              return isSelfClosing
                ? `${openTag}</${tagKey}>`
                : openTag;
            }

            if (slash === "/") {
              return "</div>";
            }

            const openTag = `<div data-unknown-component="" data-name="${escapeAttributeValue(rawName)}"${attributes}>`;
            return isSelfClosing
              ? `${openTag}</div>`
              : openTag;
          },
        );
      });
    };
  };
}

function createUnwrapCustomBlockParagraphsPlugin(customBlockTags: Set<string>) {
  return () => {
    return (tree: HastNode | undefined) => {
      if (!tree) {
        return;
      }

      unwrapCustomBlockParagraphs(tree, customBlockTags);
    };
  };
}

function unwrapCustomBlockParagraphs(
  node: HastNode | undefined,
  customBlockTags: Set<string>,
): void {
  if (!node) {
    return;
  }

  if (!Array.isArray(node.children) || node.children.length === 0) {
    return;
  }

  for (const child of node.children) {
    if (!child) {
      continue;
    }

    unwrapCustomBlockParagraphs(child, customBlockTags);
  }

  node.children = node.children.flatMap((child) => {
    if (!child) {
      return [];
    }

    if (!shouldUnwrapParagraph(child, customBlockTags)) {
      return [child];
    }

    return (child.children ?? []).filter(
      (paragraphChild): paragraphChild is HastNode => {
        if (!paragraphChild) {
          return false;
        }

        return !isWhitespaceTextNode(paragraphChild);
      },
    );
  });
}

function shouldUnwrapParagraph(
  node: HastNode,
  customBlockTags: Set<string>,
): boolean {
  if (node.type !== "element" || node.tagName !== "p") {
    return false;
  }

  const children = node.children ?? [];
  if (children.length === 0) {
    return false;
  }

  let hasCustomComponent = false;
  for (const child of children) {
    if (!child) {
      continue;
    }

    if (isWhitespaceTextNode(child)) {
      continue;
    }

    if (
      child.type === "element" &&
      typeof child.tagName === "string" &&
      customBlockTags.has(child.tagName)
    ) {
      hasCustomComponent = true;
      continue;
    }

    return false;
  }

  return hasCustomComponent;
}

function isWhitespaceTextNode(node: HastNode): boolean {
  return node.type === "text" && typeof node.value === "string"
    ? node.value.trim().length === 0
    : false;
}

function visitNodes(
  node: HastNode | undefined,
  visitor: (node: HastNode) => void,
): void {
  if (!node) {
    return;
  }

  visitor(node);

  if (!Array.isArray(node.children)) {
    return;
  }

  for (const child of node.children) {
    if (!child) {
      continue;
    }

    visitNodes(child, visitor);
  }
}

function escapeAttributeValue(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function canonicalCustomTagName(rawName: string): string {
  return rawName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}
