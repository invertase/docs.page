/// <reference types="bun" />

import { describe, expect, test } from "bun:test";
import {
  isDocsBundleNotFoundResponse,
  parseDocsBundleApiError,
} from "./docs-bundle-api";

describe("parseDocsBundleApiError", () => {
  test("preserves structured error names for final 404 logging", () => {
    const error = parseDocsBundleApiError({
      code: 404,
      error: {
        name: "FILE_NOT_FOUND",
        message: "No file was found.",
        source: "https://github.com/invertase/docs.page",
      },
    });

    expect(error).toEqual({
      name: "FILE_NOT_FOUND",
      message: "No file was found.",
      source: "https://github.com/invertase/docs.page",
    });
  });

  test("handles string errors", () => {
    expect(
      parseDocsBundleApiError({
        code: "INTERNAL_SERVER_ERROR",
        error: "Failed to load the docs bundle.",
      }),
    ).toEqual({
      message: "Failed to load the docs bundle.",
    });
  });

  test("does not throw when error field is missing", () => {
    expect(parseDocsBundleApiError({ code: 502 })).toEqual({
      name: "INVALID_BUNDLE_RESPONSE",
      message:
        "The docs bundle API returned an unexpected error payload (code: 502).",
    });
  });

  test("does not throw when error field is null", () => {
    expect(
      parseDocsBundleApiError({
        code: 403,
        error: null,
      }),
    ).toEqual({
      name: "INVALID_BUNDLE_RESPONSE",
      message:
        "The docs bundle API returned an unexpected error payload (code: 403).",
    });
  });

  test("does not throw on non-object payloads", () => {
    expect(parseDocsBundleApiError(null)).toEqual({
      name: "INVALID_BUNDLE_RESPONSE",
      message: "The docs bundle API returned an unexpected response.",
    });
  });
});

describe("isDocsBundleNotFoundResponse", () => {
  test("returns true only for code 404", () => {
    expect(isDocsBundleNotFoundResponse({ code: 404, error: "missing" })).toBe(
      true,
    );
    expect(isDocsBundleNotFoundResponse({ code: 500, error: "boom" })).toBe(
      false,
    );
    expect(isDocsBundleNotFoundResponse(null)).toBe(false);
  });
});
