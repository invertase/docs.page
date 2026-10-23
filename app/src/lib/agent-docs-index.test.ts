import { describe, expect, test } from "bun:test";
import matter from "gray-matter";
import {
  agentDocsIndexLinkHeader,
  agentLlmsTxtUrl,
  buildAgentMarkdownResponse,
  prependAgentDocsIndex,
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

describe("prependAgentDocsIndex", () => {
  test("inserts the index after frontmatter so parsers still see it", () => {
    const body = prependAgentDocsIndex(
      "---\ntitle: Start\ndescription: Hello\n---\n\n# Start\n",
      "https://docs.page/acme/handbook/llms.txt",
    );

    expect(body).toBe(
      [
        "---",
        "title: Start",
        "description: Hello",
        "---",
        "> ## Documentation Index",
        "> Fetch the complete documentation index at: https://docs.page/acme/handbook/llms.txt",
        "> Use this file to discover all available pages before exploring further.",
        "",
        "# Start",
        "",
      ].join("\n"),
    );
    expect(matter(body).data).toEqual({
      title: "Start",
      description: "Hello",
    });
    expect(matter(body).content.startsWith("> ## Documentation Index")).toBe(
      true,
    );
  });

  test("falls back to the notice plus source when frontmatter is not YAML", () => {
    const content = "---\ntitle: [unclosed\n---\n\n# Start\n";

    expect(
      prependAgentDocsIndex(
        content,
        "https://docs.page/acme/handbook/llms.txt",
      ),
    ).toBe(
      [
        "> ## Documentation Index",
        "> Fetch the complete documentation index at: https://docs.page/acme/handbook/llms.txt",
        "> Use this file to discover all available pages before exploring further.",
        "",
        content,
      ].join("\n"),
    );
  });

  test("keeps the index first when the page has no frontmatter", () => {
    expect(
      prependAgentDocsIndex(
        "# Start\n",
        "https://docs.page/acme/handbook/llms.txt",
      ),
    ).toBe(
      [
        "> ## Documentation Index",
        "> Fetch the complete documentation index at: https://docs.page/acme/handbook/llms.txt",
        "> Use this file to discover all available pages before exploring further.",
        "",
        "# Start",
        "",
      ].join("\n"),
    );
  });
});

describe("buildAgentMarkdownResponse", () => {
  test("points agents at llms.txt before the page body", () => {
    const response = buildAgentMarkdownResponse({
      content: "---\ntitle: Start\n---\n\n# Start\n",
      route: { ...handbook, requestMode: "canonical" },
      origin: "https://docs.page",
    });

    expect(response.body.startsWith("---\ntitle: Start\n---\n")).toBe(true);
    expect(response.body).toContain(
      "> Fetch the complete documentation index at: https://docs.page/acme/handbook/llms.txt",
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

  test("returns raw markdown when the request origin is not a valid URL", () => {
    const content = "---\ntitle: Start\n---\n\n# Start\n";
    const response = buildAgentMarkdownResponse({
      content,
      route: { ...handbook, requestMode: "canonical" },
      origin: "https, https://docs.page",
    });

    expect(response.body).toBe(content);
    expect(response.headers).toEqual({
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
    });
  });
});
