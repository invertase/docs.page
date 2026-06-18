---
version: "1.2.0"
updatedAt: 2026-06-16
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
4. **customize** — Theme, branding, domains, SEO, and site chrome (Features → Customize + Configure)
5. **integrate** — Agent-ready surfaces: llms.txt, MCP, agent skills, Ask AI (Features → AI)
6. **lookup** — Reference for config fields, components, CLI flags, and HTTP endpoints

Optional later: **understand** — architecture and internals (nice-to-have, not core spine).

**Features tab** — Goal-ordered capability catalog (`/features`): Publish → Organize → Customize → Configure → AI → Integrate. One page per capability; stubs link to Reference and Components where appropriate.

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
- **Features tab** (`docs/features/index.mdx`) is the canonical capability map: six groups (Publish, Organize, Customize, Configure, AI, Integrate), card overview plus one page per feature. **Every feature page is an Explanation** — what the capability is, how it fits the product, and how it behaves. At most, add a short **How-to** section for enablement steps (install app, run CLI, connect MCP). Do not write Reference-style field tables on feature pages; link to the Reference tab instead.
- **Documentation tab** holds tutorials and how-tos: Getting Started, Authoring, Customize, Agents, and Comparisons. Multi-step procedures that combine several features live here, not on Features.
- Configuration, components, and AI surfaces: conceptual coverage on Features; per-field and per-prop lookup on Reference and Components tabs.
- Add a **Comparisons** section — feature comparisons vs Docusaurus, docsify, Jekyll, etc.; migration guides deferred for v1.
- Tone: practical, zero-config friendly; emphasize “docs for humans + agents” without over-indexing on agent features before first publish.
- Feature page titles follow single-focus naming in nav; cross-links at the bottom of `/features` point to Components, Reference, and Publish your first site.

## Scan focus

- `docs/features/**` — feature page stubs and written pages (align inventory ids with slugs)
- Configuration and `docs.json` schema (`app/src/server/config/`)
- MDX components (`app/src/components/mdx/`, `docs-ir-renderer.tsx`)
- GitHub App and preview flows (`ref-previews`, `local-preview`, `cli-preview`)
- Agent surfaces: llms.txt, MCP, agent skills, Ask AI
- CLI commands (`packages/cli/src/commands/`)
