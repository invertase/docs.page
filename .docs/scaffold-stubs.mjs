#!/usr/bin/env node
/**
 * One-shot stub generator for docs-scaffold. Run from repo root:
 *   node .docs/scaffold-stubs.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const docsJson = JSON.parse(
  fs.readFileSync(path.join(ROOT, "docs.json"), "utf8"),
);
const inventory = JSON.parse(
  fs.readFileSync(path.join(ROOT, ".docs/docs-inventory.json"), "utf8"),
);
const capTitle = Object.fromEntries(
  inventory.capabilities.map((c) => [c.id, c.title]),
);

const SECTION_ROOTS = new Set(["/", "/cli", "/api", "/components", "/configuration"]);

function hrefToFile(href) {
  if (href === "/") return "docs/index.mdx";
  const stripped = href.replace(/^\//, "");
  if (SECTION_ROOTS.has(href) && href !== "/") {
    return `docs/${stripped}/index.mdx`;
  }
  return `docs/${stripped}.mdx`;
}

function bodyForDocType(docType) {
  switch (docType) {
    case "tutorial":
      return `## Prerequisites

_TBD_

## Steps

_TBD_

## Next steps

_TBD_`;
    case "how-to":
      return `## Before you begin

_TBD_

## Steps

_TBD_

## Verify

_TBD_`;
    case "reference":
      return `## Overview

_TBD_

## Reference

_TBD_`;
    case "explanation":
      return `## Overview

_TBD_

## How it works

_TBD_

## Related

_TBD_`;
    default:
      return "";
  }
}

function capabilityList(ids) {
  if (!ids.length) return "- _(editorial)_";
  return ids.map((id) => `- \`${id}\` — ${capTitle[id] ?? id}`).join("\n");
}

function planBlock(page) {
  const audience = Array.isArray(page.audience)
    ? page.audience.join(", ")
    : page.audience;
  return `{/* docs-scaffold-plan-start */}

<Info>
**Documentation plan** — remove this block when writing final content.

| | |
| --- | --- |
| **Doc type** | ${page.docType} |
| **User goal** | ${page.userGoal} |
| **Audience** | ${audience} |

${page._rationale ?? "Scaffold stub — replace with final prose via docs-write."}

**Capabilities covered**

${capabilityList(page.capabilityIds)}
</Info>

{/* docs-scaffold-plan-end */}`;
}

function sectionIndexBlock(page, allPages) {
  const prefix =
    page.href === "/configuration"
      ? "/configuration/"
      : `${page.href}/`;
  const children = allPages.filter(
    (p) =>
      p.href.startsWith(prefix) &&
      p.href !== page.href &&
      !p.href.slice(prefix.length).includes("/"),
  );

  const rows = children
    .map((c) => {
      const ids = c.capabilityIds.length ? c.capabilityIds.join(", ") : "—";
      return `| [${c.title}](${c.href}) | ${c.docType} | ${c.userGoal} | \`${ids}\` |`;
    })
    .join("\n");

  return `{/* docs-scaffold-plan-start */}

<Info>
**Section index** — remove this block when writing final content. Maps pages in this section to product capabilities.
</Info>

{/* docs-scaffold-plan-end */}

## Pages in this section

| Page | Doc type | User goal | Capabilities |
| --- | --- | --- | --- |
${rows}

## Overview

_TBD_`;
}

const pages = docsJson.outline.pages;
const rationales = {
  "/":
    "Landing page for contributors and doc readers; orients them to docs.page hosting from GitHub and agent-ready surfaces.",
  "/quickstart":
    "First-success tutorial matching the spec outcome: publish a live site with docs.json and a public GitHub repo.",
  "/writing/mdx":
    "Author-content how-to for writing MDX pages and accessing raw markdown URLs.",
  "/writing/navigation":
    "Author-content how-to for sidebar, tabs, locales, and previous/next navigation.",
  "/writing/local-preview":
    "Author-content how-to for live local preview before publishing.",
  "/writing/github-bot":
    "Author-content how-to for PR preview URLs and the GitHub bot integration.",
  "/writing/redirects":
    "Author-content how-to for frontmatter redirects between doc pages.",
  "/guides/custom-domains":
    "Customize how-to for mapping a custom domain to hosted docs.",
  "/guides/vanity-subdomains":
    "Customize how-to for {owner}.docs.page vanity URLs.",
  "/guides/search":
    "Customize how-to for enabling and using full-text docs search.",
  "/guides/seo":
    "Customize how-to for SEO settings, sitemap.xml, and robots.txt.",
  "/guides/ai-chat":
    "Integrate how-to for enabling in-docs AI chat and provisioning agents via CLI.",
  "/guides/llms-txt":
    "Integrate how-to for llms.txt and llms-full.txt agent discovery exports.",
  "/guides/mcp":
    "Integrate how-to for the per-repository MCP HTTP server and skills resources.",
  "/configuration":
    "Section index for docs.json configuration reference groups.",
  "/configuration/reference":
    "Lookup reference for the full docs.json schema and published config-schema endpoint.",
  "/compare":
    "Editorial comparisons hub for SEO — docs.page vs other static doc tools.",
  "/concepts/architecture":
    "Advanced explanation of platform architecture (deferred from Getting Started per spec).",
  "/cli":
    "Section index for CLI commands and programmatic API URL configuration.",
  "/api":
    "Section index for HTTP APIs used by integrators and agents.",
  "/components":
    "Section index for MDX components available to doc authors.",
};

for (const page of pages) {
  if (page.status === "retire" || page.status === "existing") continue;

  page._rationale = rationales[page.href];
  const filePath = path.join(ROOT, page.file);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const isSectionRoot =
    page.href === "/cli" ||
    page.href === "/api" ||
    page.href === "/components" ||
    page.href === "/configuration";

  const content = `---
title: ${JSON.stringify(page.title).slice(1, -1)}
description: ${JSON.stringify(page.description).slice(1, -1)}
---

${isSectionRoot ? sectionIndexBlock(page, pages) : `${planBlock(page)}\n\n${bodyForDocType(page.docType)}`}
`;

  fs.writeFileSync(filePath, content);
  page.status = page.status === "new" ? "stub" : page.status;
}

// Update statuses in docs.json
for (const page of docsJson.outline.pages) {
  if (page.status === "new") page.status = "stub";
}
delete docsJson.outline.pages[0]._rationale;
docsJson.outline.validation.cliCheck = {
  passed: false,
  command: "bun packages/cli/src/cli.ts check . --external-links off",
  ranAt: "2026-06-11",
  errors: 0,
  warnings: 0,
};
fs.writeFileSync(
  path.join(ROOT, "docs.json"),
  JSON.stringify(docsJson, null, 2) + "\n",
);

console.log(`Wrote ${pages.filter((p) => p.status === "stub").length} stub MDX files.`);
