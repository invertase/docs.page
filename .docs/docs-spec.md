---
version: "1.0.0"
updatedAt: 2026-06-11
---

# Documentation spec

## Positioning

Instantly serve markdown from any GitHub branch as modern, agent-ready docs — with AI chat, MCP, and llms.txt — free and open source.

## Audience

- **Primary persona:** contributor
- **Secondary:** end-user, integrator

Developers who write and share documentation with their users — product teams, open source maintainers, SDK authors, and similar.

## First success

- **Outcome:** Publish a live docs site — add a `docs.json`, push Markdown to a public GitHub repo, and open the live docs.page URL.
- **Hints:** `docs.json`, GitHub public repo, docs.page URL routing, getting-started flow

## Journeys

Ordered spine for documentation IA.

1. **orient** — What docs.page is, when to use it, docs for humans + agents
2. **first-success** — Quickstart: publish a live site from GitHub
3. **author-content** — Write MDX, navigation, frontmatter, GitHub bot for PR previews
4. **customize** — Theme, logo, nav, analytics, custom domains, local preview
5. **integrate** — Agent-ready surfaces: llms.txt, MCP, AI chat
6. **lookup** — Reference for config fields, components, and agent endpoints

Optional later: **understand** — architecture and internals (nice-to-have, not core spine).

## Policy

### Omit

- Self-hosting and operating docs.page infrastructure (`operate`)
- Internal platform metrics and admin-only tooling
- Marketing homepage copy (lives on product site, not docs)

### Advanced only

- Architecture and platform internals (`understand`)
- Edge-case behavior: global variable injection details, redirect internals, preview implementation details

GitHub bot, configuration, components, and Agents & AI are core product features — document in main docs, not advanced-only.

## Notes

- Lead with contributor quickstart; secondary readers include doc consumers (`end-user`) and agent integrators (`integrator`).
- Configuration, components, and Agents & AI are major narrative topics in the main docs; detailed field and prop lookup belongs in reference sections (IA decided at scaffold time).
- Add a **Comparisons & migrations** section — feature comparisons vs Docusaurus, docsify, Jekyll, etc., plus migration guides; prioritize for SEO.
- Tone: practical, zero-config friendly; emphasize “docs for humans + agents” without over-indexing on agent features before first publish.

## Scan focus

- Configuration and `docs.json` schema
- MDX components
- GitHub bot and preview flows
- Agent surfaces: llms.txt, MCP, AI chat
- Local preview CLI
