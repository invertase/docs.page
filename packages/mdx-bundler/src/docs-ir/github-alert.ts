type MdastNode = {
  type?: string;
  value?: string;
  children?: MdastNode[];
  position?: {
    start?: { offset?: number };
    end?: { offset?: number };
  };
};

const GITHUB_ALERT_TYPES = new Set([
  "NOTE",
  "TIP",
  "IMPORTANT",
  "WARNING",
  "CAUTION",
]);

const GITHUB_ALERT_MARKER_RE = /^\[!([A-Z]+)\]/i;

export type ParsedGithubAlert = {
  componentName: string;
  bodyNodes: MdastNode[];
};

export function githubAlertTypeToComponent(type: string): string | null {
  switch (type.toUpperCase()) {
    case "NOTE":
      return "Info";
    case "TIP":
      return "Success";
    case "IMPORTANT":
      return "Warning";
    case "WARNING":
      return "Warning";
    case "CAUTION":
      return "Error";
    default:
      return null;
  }
}

export function tryParseGithubAlert(
  blockquote: MdastNode,
): ParsedGithubAlert | null {
  const children = blockquote.children ?? [];
  if (children.length === 0) {
    return null;
  }

  const first = children[0];
  if (first.type !== "paragraph") {
    return null;
  }

  const alertType = extractAlertTypeFromParagraph(first);
  if (!alertType) {
    return null;
  }

  const componentName = githubAlertTypeToComponent(alertType);
  if (!componentName) {
    return null;
  }

  const bodyNodes = buildAlertBodyNodes(children, alertType);
  return { componentName, bodyNodes };
}

function extractAlertTypeFromParagraph(paragraph: MdastNode): string | null {
  const firstChild = paragraph.children?.[0];
  if (firstChild?.type !== "text") {
    return null;
  }

  const match = (firstChild.value ?? "").match(GITHUB_ALERT_MARKER_RE);
  if (!match?.[1]) {
    return null;
  }

  const type = match[1].toUpperCase();
  if (!GITHUB_ALERT_TYPES.has(type)) {
    return null;
  }

  return type;
}

function buildAlertBodyNodes(
  blockquoteChildren: MdastNode[],
  alertType: string,
): MdastNode[] {
  const [first, ...rest] = blockquoteChildren;
  const strippedParagraph = stripAlertMarkerFromParagraph(first, alertType);
  const body: MdastNode[] = [];

  if (strippedParagraph && paragraphHasContent(strippedParagraph)) {
    body.push(strippedParagraph);
  }

  body.push(...rest);
  return body;
}

function stripAlertMarkerFromParagraph(
  paragraph: MdastNode,
  alertType: string,
): MdastNode | null {
  const children = [...(paragraph.children ?? [])];
  if (children.length === 0) {
    return null;
  }

  const first = children[0];
  if (first?.type !== "text") {
    return null;
  }

  const markerPattern = new RegExp(
    `^\\[!${alertType}\\](?:[ \\t]*\\n?)?`,
    "i",
  );
  const value = first.value ?? "";
  if (!markerPattern.test(value)) {
    return null;
  }

  const remainder = value.replace(markerPattern, "");
  if (remainder.length === 0) {
    children.shift();
  } else {
    const { position: _position, ...restFirst } = first;
    children[0] = { ...restFirst, value: remainder };
  }

  trimLeadingEmptyTextNodes(children);

  if (children.length === 0) {
    return null;
  }

  const { position: _position, ...restParagraph } = paragraph;
  return { ...restParagraph, children };
}

function trimLeadingEmptyTextNodes(children: MdastNode[]): void {
  while (children.length > 0) {
    const first = children[0];
    if (first?.type !== "text") {
      break;
    }

    if ((first.value ?? "").trim().length > 0) {
      break;
    }

    children.shift();
  }
}

function paragraphHasContent(paragraph: MdastNode): boolean {
  for (const child of paragraph.children ?? []) {
    if (child.type === "text") {
      if ((child.value ?? "").trim().length > 0) {
        return true;
      }
      continue;
    }

    return true;
  }

  return false;
}
