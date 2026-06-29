import { describe, expect, test } from "bun:test";
import { InvalidDocPathError, normalizeDocPath } from "./docs-paths";

describe("normalizeDocPath", () => {
  test("preserves docs/ as a content segment", () => {
    expect(normalizeDocPath("docs/overview")).toBe("docs/overview");
  });

  test("normalizes simple paths", () => {
    expect(normalizeDocPath("stories/overview")).toBe("stories/overview");
    expect(normalizeDocPath("index")).toBe("index");
  });

  test("rejects traversal attempts", () => {
    expect(() => normalizeDocPath("../secrets")).toThrow(InvalidDocPathError);
    expect(() => normalizeDocPath("docs/../secrets")).toThrow(
      InvalidDocPathError,
    );
  });
});
