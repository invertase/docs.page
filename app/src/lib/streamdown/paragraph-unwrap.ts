import type { ExtraProps } from "streamdown";
import { DOC_CUSTOM_BLOCK_TAGS } from "./allowed-tags";

export type HastElement = NonNullable<ExtraProps["node"]>;
export type HastChild = HastElement["children"][number];

/** HAST `data-unknown-component` markers (both property spellings used in the tree vs React props). */
export function hasUnknownCustomComponentMarker(
  props: Record<string, unknown> | undefined,
): boolean {
  return props
    ? Object.prototype.hasOwnProperty.call(props, "data-unknown-component") ||
        Object.prototype.hasOwnProperty.call(props, "dataUnknownComponent")
    : false;
}

export function shouldUnwrapParagraphNode(node: unknown): node is HastElement {
  if (!node || typeof node !== "object") {
    return false;
  }

  const paragraphNode = node as HastElement;
  if (paragraphNode.type !== "element" || paragraphNode.tagName !== "p") {
    return false;
  }

  let hasCustomBlockChild = false;
  for (const child of paragraphNode.children ?? []) {
    if (isWhitespaceHastText(child)) {
      continue;
    }

    if (isCustomBlockElement(child)) {
      hasCustomBlockChild = true;
      continue;
    }

    return false;
  }

  return hasCustomBlockChild;
}

export function isCustomBlockElement(child: HastChild): child is HastElement {
  return (
    child.type === "element" &&
    (DOC_CUSTOM_BLOCK_TAGS.has(child.tagName) ||
      (child.tagName === "div" &&
        hasUnknownCustomComponentMarker(child.properties)))
  );
}

function isWhitespaceHastText(child: HastChild): boolean {
  return child.type === "text" && child.value.trim().length === 0;
}
