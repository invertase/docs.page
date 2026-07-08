/// <reference types="bun" />

import { describe, expect, test } from "bun:test";
import { parseDocsBundleApiError } from "./docs-bundle-api";

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
});
