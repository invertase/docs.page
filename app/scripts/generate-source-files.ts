/**
 * Collects tracked-ish repo file paths for the homepage source preview.
 *
 * Usage (from `app/`):
 *   bun scripts/generate-source-files.ts
 *
 * Or: `bun run generate:source-files`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Bun from "bun";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(__dirname, "..");
const repoRoot = path.join(appRoot, "..");
const defaultOut = path.join(appRoot, "src/components/homepage/source-files.json");

const outPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultOut;

/** Path segments that should never appear in the generated tree. */
const IGNORED_SEGMENTS = new Set([
  ".cache",
  ".db",
  ".git",
  ".idea",
  ".next",
  ".output",
  ".pnp",
  ".vercel",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);

/** Top-level or leaf file names to skip. */
const IGNORED_FILES = new Set([
  ".DS_Store",
  "bun.lock",
  "next-env.d.ts",
  "package-lock.json",
]);

function shouldIgnore(relativePath: string): boolean {
  const segments = relativePath.split("/");

  if (segments.some((segment) => IGNORED_SEGMENTS.has(segment))) {
    return true;
  }

  const fileName = segments.at(-1);
  if (!fileName) {
    return true;
  }

  if (IGNORED_FILES.has(fileName)) {
    return true;
  }

  if (fileName.endsWith(".tsbuildinfo")) {
    return true;
  }

  return false;
}

function collectSourcePaths(): string[] {
  const glob = new Bun.Glob("**/*");
  const paths: string[] = [];

  for (const file of glob.scanSync({ cwd: repoRoot, onlyFiles: true })) {
    if (!shouldIgnore(file)) {
      paths.push(file);
    }
  }

  paths.sort((a, b) => a.localeCompare(b));
  return paths;
}

async function main() {
  const paths = collectSourcePaths();

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(paths, null, 2)}\n`, "utf8");

  console.log(
    `Wrote ${paths.length} source path(s) to ${path.relative(appRoot, outPath)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
