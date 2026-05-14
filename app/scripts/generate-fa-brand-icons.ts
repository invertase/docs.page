/**
 * Extracts Font Awesome *brand* icon slugs from the self-hosted webfont kit
 * (`public/_docs.page/fa/brands.min.css`).
 *
 * We only collect selectors that define a glyph (`{--fa:"..."}`), not utility
 * rules like `.fa-brands { --fa-family: ... }`.
 *
 * Usage (from `app/`):
 *   bun scripts/generate-fa-brand-icons.ts
 *
 * Or: `bun run generate:fa-brand-icons`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(__dirname, "..");
const defaultCss = path.join(
  appRoot,
  "public/_docs.page/fa/brands.min.css",
);
const defaultOut = path.join(
  appRoot,
  "src/components/mdx/fa-brand-icons.json",
);

const cssPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultCss;
const outPath = process.argv[3] ? path.resolve(process.argv[3]) : defaultOut;

const css = fs.readFileSync(cssPath, "utf8");
const names = new Set<string>();

for (let pos = 0; ; ) {
  const idx = css.indexOf('{--fa:"', pos);
  if (idx === -1) break;

  const prevClose = css.lastIndexOf("}", idx);
  const selector = css.slice(prevClose + 1, idx);

  for (const part of selector.split(",")) {
    for (const mm of part.matchAll(/\.fa-([a-z0-9-]+)/g)) {
      names.add(mm[1]!);
    }
  }
  pos = idx + 1;
}

/** Class tokens that match `.fa-*` but are not icon glyphs in FA 6/7 brands CSS. */
for (const noise of ["brands", "classic"] as const) {
  names.delete(noise);
}

const sorted = [...names].sort((a, b) => a.localeCompare(b));
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");

console.log(
  `Wrote ${sorted.length} brand icon slug(s) to ${path.relative(appRoot, outPath)}`,
);
