import { describe, expect, test } from "bun:test";
import { hasDocsChanges, isDocsFile } from "./docs-files";

describe("isDocsFile", () => {
  test("matches files under a docs/ directory at the repo root", () => {
    expect(isDocsFile("docs/intro.mdx")).toBe(true);
  });

  test("matches files under a docs/ directory in a monorepo subdirectory", () => {
    expect(isDocsFile("packages/x/docs/y.mdx")).toBe(true);
  });

  test("matches docs.json at the repo root", () => {
    expect(isDocsFile("docs.json")).toBe(true);
  });

  test("matches docs.yaml in a subdirectory", () => {
    expect(isDocsFile("app/docs.yaml")).toBe(true);
  });

  test("rejects unrelated source files", () => {
    expect(isDocsFile("src/index.ts")).toBe(false);
    expect(isDocsFile("README.md")).toBe(false);
  });

  test("rejects non-segment matches like mydocs/", () => {
    expect(isDocsFile("mydocs/x")).toBe(false);
  });

  test("rejects files whose names merely contain docs", () => {
    expect(isDocsFile("src/docs.ts")).toBe(false);
    expect(isDocsFile("docs.md")).toBe(false);
  });
});

describe("hasDocsChanges", () => {
  test("returns true when at least one path is a docs file", () => {
    expect(hasDocsChanges(["src/index.ts", "docs/intro.mdx"])).toBe(true);
  });

  test("returns false when no path is a docs file", () => {
    expect(hasDocsChanges(["src/index.ts", "README.md"])).toBe(false);
  });

  test("returns false for an empty change set", () => {
    expect(hasDocsChanges([])).toBe(false);
  });
});
