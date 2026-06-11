#!/usr/bin/env node
/**
 * Minimal stub generator for docs-scaffold. Run from repo root:
 *   node .docs/scaffold-stubs.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const docsJson = JSON.parse(
  fs.readFileSync(path.join(ROOT, "docs.json"), "utf8"),
);

const SECTION_ROOTS = new Set([
  "/",
  "/cli",
  "/api",
  "/components",
  "/configuration",
]);

function bodyForDocType(docType, isSectionRoot) {
  if (isSectionRoot) {
    return `## Overview

_TBD_`;
  }
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
      return `## Summary

_TBD_

## Details

_TBD_`;
    default:
      return `## Overview

_TBD_`;
  }
}

const pages = docsJson.outline.pages;
let written = 0;

for (const page of pages) {
  if (page.status === "retire" || page.status === "existing") continue;

  const filePath = path.join(ROOT, page.file);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const isSectionRoot = SECTION_ROOTS.has(page.href) && page.href !== "/"
    ? page.file.endsWith("/index.mdx")
    : page.href === "/" || SECTION_ROOTS.has(page.href);

  const content = `---
title: ${page.title}
description: ${page.description}
---

${bodyForDocType(page.docType, isSectionRoot && page.href !== "/")}
`;

  fs.writeFileSync(filePath, content);
  if (page.status === "new") page.status = "stub";
  written++;
}

fs.writeFileSync(
  path.join(ROOT, "docs.json"),
  JSON.stringify(docsJson, null, 2) + "\n",
);

console.log(`Wrote ${written} minimal stub MDX files.`);
