import { describe, expect, test } from "bun:test";

import { AGENT_PROVIDERS, getModelForProvider } from "./providers";

describe("getModelForProvider", () => {
  // The agent route rejects a request with a 400 when a provider resolves to
  // no model, so every supported provider needs an entry in the model map.
  test.each([...AGENT_PROVIDERS])("returns a model for %s", (provider) => {
    expect(getModelForProvider(provider)).toBeString();
  });

  test("returns undefined for an unknown provider", () => {
    expect(getModelForProvider("nope")).toBeUndefined();
  });
});
