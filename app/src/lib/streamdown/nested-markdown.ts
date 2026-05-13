import {
  Children,
  isValidElement,
  type ReactNode,
} from "react";

/** Plain-text-only custom-component bodies → nested markdown render. */
export function extractTextOnlyContent(children: ReactNode): string | null {
  const childNodes = Children.toArray(children);

  if (childNodes.some((child) => isValidElement(child))) {
    return null;
  }

  return childNodes
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : "",
    )
    .join("");
}

export function normalizeNestedMarkdown(markdown: string): string {
  const lines = markdown.split("\n");
  const startIndex = lines.findIndex((line) => line.trim().length > 0);

  if (startIndex === -1) {
    return "";
  }

  let endIndex = lines.length - 1;
  while (endIndex >= startIndex && lines[endIndex]?.trim().length === 0) {
    endIndex -= 1;
  }

  const contentLines = lines.slice(startIndex, endIndex + 1);
  const minimumIndent = Math.min(
    ...contentLines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^[ \t]*/)![0].length),
  );

  if (!Number.isFinite(minimumIndent) || minimumIndent === 0) {
    return contentLines.join("\n");
  }

  return contentLines
    .map((line) => line.slice(Math.min(minimumIndent, line.length)))
    .join("\n");
}

export function renderComponentChildren(
  children: ReactNode,
  renderNestedMarkdown: (markdown: string) => ReactNode,
): ReactNode {
  const textContent = extractTextOnlyContent(children);
  if (textContent === null) {
    return children;
  }

  const markdown = normalizeNestedMarkdown(textContent);
  return markdown ? renderNestedMarkdown(markdown) : children;
}
