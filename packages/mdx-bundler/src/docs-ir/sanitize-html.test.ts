import { describe, expect, test } from "bun:test";
import { preprocessMarkdownInHtml, sanitizeHtml } from "./sanitize-html";

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

  test("preserves safe iframe embeds", async () => {
    const result = await sanitizeHtml(
      '<iframe src="https://preview.widgetbook.io/#/?path=knobpreview/bool-knob&panels=knobs" width="100%" height="240px" />',
    );
    expect(result).toContain("<iframe");
    expect(result).toContain('src="https://preview.widgetbook.io/');
    expect(result).toContain('width="100%"');
    expect(result).toContain('height="240px"');
  });

  test("strips javascript: iframe src", async () => {
    const result = await sanitizeHtml('<iframe src="javascript:alert(1)" />');
    expect(result).toContain("<iframe");
    expect(result).not.toContain("javascript:");
    expect(result).not.toContain('src="javascript:');
  });

  test("converts markdown image links embedded in HTML table cells", async () => {
    const input = `<table><tr><td>[<img src="https://example.com/thumb.png" width="150"/>](https://example.com/full.png)</td></tr></table>`;
    const preprocessed = preprocessMarkdownInHtml(input);
    expect(preprocessed).toContain(
      '<a href="https://example.com/full.png"><img src="https://example.com/thumb.png" width="150"/>',
    );

    const result = await sanitizeHtml(input);
    expect(result).toContain('href="https://example.com/full.png"');
    expect(result).not.toContain("](");
  });
});
