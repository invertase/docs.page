import type { CheckResult, Route, Routes } from "./types";

const CODE_BLOCK = /```[\s\S]*?```/g;

const IDENTIFIERS = {
  // Matches all markdown links (e.g. [text](href))
  MD_LINK: /\[.*?\]\((.*?)\)/g,
  // Matches all markdown images (e.g. ![alt](src))
  MDX_IMAGE: /!\[.*?\]\((.*?)\)/g,
  // Matches all anchor html tags (e.g. <a href="href">)
  ANCHOR_HREF: /<a\s+(?:[^>]*?\s+)?href="(.*?)"/g,
  // Matches all image html tags (e.g. <img src="src">)
  IMAGE_SRC: /<img\s+(?:[^>]*?\s+)?src="(.*?)"/g,
  // Matches all MDX Image components (e.g. <Image src="src">)
  MDX_IMAGE_SRC: /<Image\s+(?:[^>]*?\s+)?src="(.*?)"/g,
  // Matches all video html tags (e.g. <video src="src">)
  VIDEO_SRC: /<video\s+(?:[^>]*?\s+)?src="(.*?)"/g,
  // Matches all MDX Video components (e.g. <Video src="src">)
  MDX_VIDEO_SRC: /<Video\s+(?:[^>]*?\s+)?src="(.*?)"/g,
  // Matches all card html tags (e.g. <Card href="href">)
  MDX_CARD_HREF: /<Card\s+(?:[^>]*?\s+)?href="(.*?)"/g,
};

export function* checkRelativeLinks(routes: Routes): Generator<CheckResult> {
  for (const [, route] of routes) {
    const { content } = route;

    let cursor = 0;

    // Find all code blocks in the content
    const matches = [...content.matchAll(CODE_BLOCK)];

    // Iterate each match, only processing the content around the code blocks.
    for (const match of matches) {
      const start = match.index;
      const end = match.index + match[0].length;

      // Process the content around the code block.
      yield* processMarkdownBlock(
        content.substring(cursor, start),
        route,
        routes,
      );

      // Update the cursor to the end of the code block
      cursor = end;
    }

    // Process the remaining content after the last code block
    yield* processMarkdownBlock(content.substring(cursor), route, routes);
  }
}

function* processMarkdownBlock(
  content: string,
  route: Route,
  routes: Routes,
): Generator<CheckResult> {
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1; // 1-based line index
    const line = lines[i];

    for (const [, regex] of Object.entries(IDENTIFIERS)) {
      // Reset the regex state before using it
      regex.lastIndex = 0;
      let match: RegExpExecArray | null = null;

      // biome-ignore lint/suspicious/noAssignInExpressions: This is ok for here.
      while ((match = regex.exec(line)) !== null) {
        const link = match[1];
        const column = match.index + 1; // 1-based column index

        // If the link is a relative link, check if it exists in the routes
        if (link.startsWith("/")) {
          // Remove the hash from the link, if it exists.
          const [linkPath] = link.split("#");

          if (!routes.has(linkPath)) {
            yield {
              type: "error",
              message: `Documentation contains a broken link ('${linkPath}').`,
              filePath: route.filePath,
              line: lineNumber,
              column,
            };
          }
        }
      }
    }
  }
}
