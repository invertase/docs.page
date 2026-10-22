import { describe, expect, test } from "bun:test";
import {
  agentDocsIndexLinkHeader,
  agentLlmsTxtUrl,
  buildAgentMarkdownResponse,
} from "./agent-docs-index";

const handbook = {
  owner: "acme",
  repository: "handbook",
  ref: null,
} as const;

describe("agentLlmsTxtUrl", () => {
  test("uses the docs.page owner and repository path", () => {
    expect(
      agentLlmsTxtUrl(
        { ...handbook, requestMode: "canonical" },
        "https://docs.page",
      ),
    ).toBe("https://docs.page/acme/handbook/llms.txt");
  });

  test("keeps the ref segment on branch previews", () => {
    expect(
      agentLlmsTxtUrl(
        { ...handbook, requestMode: "canonical", ref: "feature/docs" },
        "https://docs.page",
      ),
    ).toBe("https://docs.page/acme/handbook~feature%2Fdocs/llms.txt");
  });

  test("drops the owner segment on vanity subdomains", () => {
    expect(
      agentLlmsTxtUrl(
        { ...handbook, requestMode: "vanity" },
        "https://acme.docs.page",
      ),
    ).toBe("https://acme.docs.page/handbook/llms.txt");
  });

  test("serves the index at the custom-domain root", () => {
    expect(
      agentLlmsTxtUrl(
        { ...handbook, requestMode: "custom-domain" },
        "https://docs.acme.com",
      ),
    ).toBe("https://docs.acme.com/llms.txt");
  });
});

describe("buildAgentMarkdownResponse", () => {
  test("points agents at llms.txt before the page source", () => {
    const response = buildAgentMarkdownResponse({
      content: "---\ntitle: Start\n---\n\n# Start\n",
      route: { ...handbook, requestMode: "canonical" },
      origin: "https://docs.page",
    });

    expect(response.body).toBe(
      [
        "> ## Documentation Index",
        "> Fetch the complete documentation index at: https://docs.page/acme/handbook/llms.txt",
        "> Use this file to discover all available pages before exploring further.",
        "",
        "---",
        "title: Start",
        "---",
        "",
        "# Start",
        "",
      ].join("\n"),
    );
    expect(response.headers["Content-Type"]).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.Vary).toBe("Accept");
    expect(response.headers["x-llms-txt"]).toBe(
      "https://docs.page/acme/handbook/llms.txt",
    );
    expect(response.headers.Link).toBe(
      agentDocsIndexLinkHeader(
        { ...handbook, requestMode: "canonical" },
        "https://docs.page",
      ),
    );
    expect(response.headers.Link).toContain(
      '<https://docs.page/acme/handbook/llms.txt>; rel="llms-txt"',
    );
    expect(response.headers.Link).toContain(
      '<https://docs.page/acme/handbook/llms-full.txt>; rel="llms-full-txt"',
    );
  });
});
