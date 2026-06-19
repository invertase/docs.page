# Documentation tab — action list

Track coverage, links, and file-path alignment for pages on the **Documentation** tab (`tab: "docs"` in `docs.json`).

## Completed

- [x] Audit `docs.json` hrefs vs `docs/**/*.mdx` file paths — all nav entries resolve
- [x] Run `docs check` — no broken internal links or assets
- [x] Add missing feature references on Documentation tab pages
- [x] Fix broken anchor link (`/authoring/write#internal-links` → `#links-and-assets`)
- [x] Fix Comparisons hub link on Introduction (`/comparisons/index`)
- [x] Remove redirect stub files — canonical pages only; no legacy URL redirects

## Reference tab

- [x] Four-page Reference nav: `docs.json`, `Page frontmatter`, `CLI`, `HTTP endpoints`
- [x] Merged former pages into `docs-json-reference` (`variables`, `scripts`) and `http-endpoints` (`search.json`, URL patterns)
- [x] Reference tab `href` → `/reference/docs-json-reference` (no `/reference` index stub)

## File path map (Documentation tab)

| `docs.json` href | File |
| --- | --- |
| `/` | `docs/index.mdx` |
| `/publish-your-first-site` | `docs/publish-your-first-site.mdx` |
| `/authoring/write` | `docs/authoring/write.mdx` |
| `/authoring/organise` | `docs/authoring/organise.mdx` |
| `/authoring/preview` | `docs/authoring/preview.mdx` |
| `/authoring/publish` | `docs/authoring/publish.mdx` |
| `/authoring/redirects` | `docs/authoring/redirects.mdx` |
| `/authoring/locales` | `docs/authoring/locales.mdx` |
| `/customize/apply-your-branding` | `docs/customize/apply-your-branding.mdx` |
| `/customize/connect-a-custom-domain` | `docs/customize/connect-a-custom-domain.mdx` |
| `/customize/improve-search-visibility` | `docs/customize/improve-search-visibility.mdx` |
| `/customize/track-reader-engagement` | `docs/customize/track-reader-engagement.mdx` |
| `/ai-agents/agent-ready-docs` | `docs/ai-agents/agent-ready-docs.mdx` |
| `/ai-agents/llms-txt` | `docs/ai-agents/llms-txt.mdx` |
| `/ai-agents/mcp-server` | `docs/ai-agents/mcp-server.mdx` |
| `/ai-agents/agent-skills` | `docs/ai-agents/agent-skills.mdx` |
| `/ai-agents/ask-ai` | `docs/ai-agents/ask-ai.mdx` |
| `/ai-agents/embed-ask-ai` | `docs/ai-agents/embed-ask-ai.mdx` |
| `/comparisons/index` | `docs/comparisons/index.mdx` |
| `/comparisons/docs-page-vs-*` | `docs/comparisons/docs-page-vs-*.mdx` |

## File path map (Reference tab)

| `docs.json` href | File |
| --- | --- |
| `/reference/docs-json-reference` | `docs/reference/docs-json-reference.mdx` |
| `/reference/page-frontmatter` | `docs/reference/page-frontmatter.mdx` |
| `/reference/cli-reference` | `docs/reference/cli-reference.mdx` |
| `/reference/http-endpoints` | `docs/reference/http-endpoints.mdx` |
