const LLMS_TXT = `# docs.page

> docs.page hosts agent-ready documentation from any GitHub Markdown repository — with search, AI chat, an MCP server, and llms.txt — and no build step.

## Documentation
- [Documentation](https://use.docs.page): full product documentation
- [Get started](https://use.docs.page/quickstart): quickstart guide
- [CLI](https://use.docs.page/reference/cli): local preview and project tooling
- [GitHub](https://github.com/invertase/docs.page): source repository (Apache-2.0)

## Agent surfaces
Every site hosted on docs.page exposes machine-readable endpoints at a predictable per-repository pattern, where \`{owner}/{repo}\` is the backing GitHub repository:
- \`https://docs.page/{owner}/{repo}/llms.txt\`: LLM-oriented index of the site's pages
- \`https://docs.page/{owner}/{repo}/llms-full.txt\`: full concatenated Markdown of the site
- \`https://docs.page/{owner}/{repo}/mcp\`: Model Context Protocol server (tools: read_doc_page, list_doc_files)
- \`https://docs.page/{owner}/{repo}/search.json\`: search index
- Append \`.md\` or \`.mdx\` to any documentation page URL to fetch its raw Markdown source
`;

export function GET() {
  return new Response(LLMS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
