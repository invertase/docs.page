import { describe, expect, test } from "bun:test";
import { isExternalLink } from "./docs-links";

describe("isExternalLink", () => {
  test("treats http(s) and protocol-relative urls as external", () => {
    expect(isExternalLink("http://example.com")).toBe(true);
    expect(isExternalLink("https://example.com")).toBe(true);
    expect(isExternalLink("https://example.com/page#section")).toBe(true);
    expect(isExternalLink("//example.com")).toBe(true);
  });

  test("treats non-http url schemes as external", () => {
    expect(isExternalLink("mailto:hello@example.com")).toBe(true);
    expect(isExternalLink("tel:+15551234567")).toBe(true);
    expect(isExternalLink("sms:+15551234567")).toBe(true);
    expect(isExternalLink("skype:username?call")).toBe(true);
    expect(isExternalLink("geo:37.786971,-122.399677")).toBe(true);
    expect(isExternalLink("file:///path/to/file")).toBe(true);
  });

  test("treats internal paths and fragments as not external", () => {
    expect(isExternalLink("/foo")).toBe(false);
    expect(isExternalLink("foo/bar")).toBe(false);
    expect(isExternalLink("#anchor")).toBe(false);
    expect(isExternalLink("?x=1")).toBe(false);
    expect(isExternalLink("")).toBe(false);
  });
});
