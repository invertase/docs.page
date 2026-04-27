import type { ComponentProps } from "react";
import { defaultRehypePlugins, type Streamdown } from "streamdown";

type AllowedTags = Record<string, string[]>;
type RehypePlugins = NonNullable<
  ComponentProps<typeof Streamdown>["rehypePlugins"]
>;
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

export function createDocsPageRehypePlugins(
  allowedTags: AllowedTags,
): RehypePlugins {
  // Custom tags are matched case-insensitively during normalization so
  // authors can write `<Info>` while Streamdown ultimately renders `<info>`.
  const knownComponents = new Set(
    Object.keys(allowedTags).map((tag) => tag.toLowerCase()),
  );
  const customBlockTags = new Set([...knownComponents, UNKNOWN_COMPONENT_TAG]);
  // Streamdown ships its own sanitize plugin tuple; keep that plugin instance
  // and extend only the schema so our custom tags survive sanitization.
  const sanitizePlugin = Array.isArray(defaultRehypePlugins.sanitize)
    ? defaultRehypePlugins.sanitize[0]
    : defaultRehypePlugins.sanitize;
  const sanitizeSchema = (
    Array.isArray(defaultRehypePlugins.sanitize)
      ? defaultRehypePlugins.sanitize[1]
      : {}
  ) as SanitizeSchema;
  // Rebuild the sanitize tuple with our docs-page tags and attributes merged
  // into Streamdown's default allowlist instead of replacing it outright.
  const sanitizeEntry = [
    sanitizePlugin as RehypePlugins[number],
    {
      ...sanitizeSchema,
      tagNames: Array.from(
        new Set([
          ...(sanitizeSchema.tagNames ?? []),
          ...Object.keys(allowedTags),
        ]),
      ),
      attributes: {
        ...(sanitizeSchema.attributes ?? {}),
        ...allowedTags,
      },
    },
  ] as RehypePlugins[number];

  return [
    createNormalizeCustomTagsPlugin(knownComponents),
    defaultRehypePlugins.raw,
    sanitizeEntry,
    defaultRehypePlugins.harden,
    createUnwrapCustomBlockParagraphsPlugin(customBlockTags),
  ];
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
            const normalizedName = rawName.toLowerCase();
            const isKnownComponent = knownComponents.has(normalizedName);
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
                return `</${normalizedName}>`;
              }

              const openTag = `<${normalizedName}${attributes}>`;
              return isSelfClosing ? `${openTag}</${normalizedName}>` : openTag;
            }

            if (slash === "/") {
              return "</div>";
            }

            const openTag = `<div data-unknown-component="" data-name="${escapeAttributeValue(rawName)}"${attributes}>`;
            return isSelfClosing ? `${openTag}</div>` : openTag;
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
