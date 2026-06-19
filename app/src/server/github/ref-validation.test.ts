import { describe, expect, test } from "bun:test";
import { isUnresolvedNumericRef } from "./ref-validation";

describe("isUnresolvedNumericRef", () => {
  test("flags numeric refs that fell through PR resolution", () => {
    expect(isUnresolvedNumericRef("816", { type: "branch" })).toBe(true);
  });

  test("allows numeric refs once they resolve to PR metadata", () => {
    expect(isUnresolvedNumericRef("816", { type: "PR" })).toBe(false);
  });

  test("allows non-numeric branch names", () => {
    expect(isUnresolvedNumericRef("release-816", { type: "branch" })).toBe(
      false,
    );
  });
});
