import { describe, expect, test } from "bun:test";
import { sanitizeHtml } from "./sanitize-html";

describe("sanitizeHtml", () => {
  test("removes script tags and event handlers", async () => {
    const result = await sanitizeHtml(
      '<p onclick="alert(1)">Hi</p><script>alert("xss")</script>',
    );
    expect(result).not.toContain("script");
    expect(result).not.toContain("onclick");
    expect(result).toContain("Hi");
  });

  test("preserves safe badge-style HTML", async () => {
    const input =
      '<p align="center" class="flex justify-center"><a href="https://example.com"><img src="https://img.shields.io/badge/test" alt="test" /></a></p>';
    const result = await sanitizeHtml(input);
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('class="flex justify-center"');
    expect(result).toContain("<img");
  });

  test("strips javascript: URLs", async () => {
    const result = await sanitizeHtml('<a href="javascript:alert(1)">bad</a>');
    expect(result).not.toContain("javascript:");
  });
});
