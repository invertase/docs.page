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

  test("allows version-like segments and extensionless pages", () => {
    expect(normalizeDocPath("releases/v2.0.0")).toBe("releases/v2.0.0");
    expect(normalizeDocPath("auth/usage")).toBe("auth/usage");
    expect(normalizeDocPath("index")).toBe("index");
  });

  test("rejects archive, script, and hidden-file probes", () => {
    expect(() => normalizeDocPath("backup/backup.tgz")).toThrow(
      InvalidDocPathError,
    );
    expect(() => normalizeDocPath("error_logs.tar.gz")).toThrow(
      InvalidDocPathError,
    );
    expect(() => normalizeDocPath("admin/function.php")).toThrow(
      InvalidDocPathError,
    );
    expect(() => normalizeDocPath("decrypt.zip")).toThrow(InvalidDocPathError);
    expect(() => normalizeDocPath("secrets.env")).toThrow(InvalidDocPathError);
    expect(() => normalizeDocPath(".env.old.tgz")).toThrow(InvalidDocPathError);
    expect(() => normalizeDocPath(".well-known/acme-challenge/x")).toThrow(
      InvalidDocPathError,
    );
    expect(() => normalizeDocPath("apple-touch-icon.png")).toThrow(
      InvalidDocPathError,
    );
    expect(() =>
      normalizeDocPath("docs/v3.1.*/messaging/reference/messaging"),
    ).toThrow(InvalidDocPathError);
  });
});
