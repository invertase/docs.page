---
version: "3.1.0"
updatedAt: 2026-06-16
status: pending-review
---

# Documentation outline

## 1. Audience mental model

This outline serves **contributors** — developers who publish and maintain documentation for their users (product teams, open-source maintainers, SDK authors). Secondary readers include **end-users** who consume published docs and **integrators** who wire docs.page into agents and tooling.

The mental model to build: **docs.page is docs-as-code with no hosting setup**. You add a `docs.json` and pages to a public GitHub repo; docs.page serves them instantly at a live URL. The same site is readable by humans and discoverable by agents via llms.txt, MCP, and Ask AI — without a separate build pipeline, dashboard, or paid tier. Configuration lives in Git; customization is declarative.

**Two top-level tabs for contributors:**

1. **Documentation** — journey-ordered guides: Getting Started, Core concepts, Authoring, Customize, Components, AI agents, Comparisons, Reference.
2. **Features** (`/features`) — goal-ordered capability catalog aligned with `docs/features/index.mdx`: **Publish → Organize → Customize → Configure → AI → Integrate**. One **Explanation** page per capability (Overview → How it works → Related). Setup steps belong in a short **Enable it** section at most — not full how-to guides. Field lookup and flags live on Reference.

**Two-layer model (Documentation tab):**

1. **Core concepts** — bottom-up explanations of how docs.page works. Author these first; each page stands alone. Some pages are **temporary homes** for content that may later fold into Authoring, Customize, or Reference once workflow pages are written.
2. **Authoring content** — workflow-oriented how-tos that cherry-pick from Core concepts. Thin on mechanics, rich on *when* and *in what order*.

**Contributor loop (composed in Authoring, explained in Core concepts):** `docs init` → write and organize → **`docs preview`** (local iteration) → **`docs check`** (sub-step before push, still under Previews) → push → shareable `~ref` preview → merge to main → maintain.

---

## 2. Competitor analysis

### Mintlify (primary competitor)

Mintlify is the closest equivalent: MDX content, a root `docs.json` config file, Git-backed publishing, PR preview deployments, built-in search, custom domains, an AI assistant, llms.txt/MCP agent surfaces, and a large component library. Structural patterns worth adopting or adapting:

| Mintlify section | Pattern | docs.page adaptation |
| --- | --- | --- |
| **Get started** (Introduction, Quickstart) | Short orient + hands-on first publish | **Getting Started** with nested **Templates** subgroup after Publish your first site |
| **Create** (Format text, code, images, redirects) | Writing-oriented how-tos, not "MDX" framing | **Write documentation** and related authoring pages use content-writing language; MDX is implementation detail in prose |
| **Organize** (Navigation, pages, settings) | Split across many config pages | **Core concepts → Navigation** for the model; **Organize your navigation** (Authoring) for workflow; field lookup in **docs.json reference** |
| **Components** | Dedicated top-level section with overview + per-component pages | **Match:** standalone **Components** section, separate from config/API reference |
| **Customize** (Themes, custom domain, fonts) | Appearance goals | Reframe as user goals: branding, domain, SEO, analytics — not one page per config key |
| **Deploy** (GitHub, previews, monorepo) | Heavy infra section | Fold preview/review into authoring workflow pages; no deploy dashboard docs |
| **CLI** | Dedicated CLI section | **Core concepts** explains what the CLI does; **CLI reference** holds flag lookup |
| **Editor** (web WYSIWYG) | Major differentiator | **Omit** — note in product comparisons |
| **AI-native / Assistant / Agent** | Large AI section | **Features → AI** group plus **AI agents** on Documentation tab |
| **API playground** (OpenAPI) | Entire vertical | **Omit** — note in comparisons |
| **Migration** | Dedicated migration hub | **Defer** — comparisons only for v1 per author feedback |
| **Guides** (help center, API docs, content types) | Editorial patterns by documentation type | Nested **Templates** under Getting Started — Diátaxis page layouts for contributors |

**Key adaptations vs Mintlify:** Journey-ordered Documentation tab, dedicated **Features** capability catalog, goal-driven authoring/customize sections, Components as its own tab, slim Getting Started, product comparisons without migration guides for now.

### Other equivalents (brief)

- **Docusaurus / docsify / Jekyll / GitHub Pages:** Static-site or build-and-host workflows. Contrast with instant GitHub publish; cover in **Platform comparisons** as peer product pages, not migration how-tos.
- **ReadMe / GitBook:** Hosted platforms with proprietary editors. Position docs.page as open-source, Git-native, and agent-ready by default.

---

## 3. The sitemap

### Features

Goal-ordered capability catalog on the **Features** tab (`docs/features/index.mdx`). **Page type: Explanation** for every feature page — build understanding of what the capability is and how it behaves. Link out to Reference and Components for field-level lookup; link to Documentation tab for multi-step workflows.

**Optional hybrid:** Explanation + short **Enable it** section (numbered steps) when a feature requires one-time setup — local preview, custom domains, MCP, Ask AI, GitHub App. Do not promote these to full how-to guides; procedural depth stays on the Documentation tab.

**Layout:** Overview → How it works → Enable it (if needed) → Related. Follow the [Explanation template](/templates/explanation).

**Inventory ids** in parentheses for traceability.

**Nav structure:** `Features` → `Overview` · `Publish` · `Organize` · `Customize` · `Configure` · `AI` · `Integrate`

#### Overview

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Features | Explanation | **Must have** | Card overview of every hosted capability grouped by contributor goal. Cross-link to Components, Reference, and Publish your first site. |

#### Publish

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Public GitHub hosting | Explanation | **Must have** | How push-to-publish works from a public repo: default branch URLs, request-time bundling, public-repos-only. (`github-hosting`) — **written**. |
| Components | Explanation | **Must have** | What built-in MDX components are, why no imports are needed, and when to use them vs plain Markdown. Link to Components tab for props. (`mdx-components`) |
| Local preview | Explanation + How-to | **Must have** | How local preview fits the publish loop; WebSocket + `docs.page/preview` architecture. Short **Enable it**: run `docs preview`. (`local-preview`, `cli-preview`) |
| Branch preview | Explanation | **Must have** | Shareable `~ref` URLs for branches, commits, and pull requests — routing model and when to use vs local preview. (`ref-previews`) |
| CLI | Explanation | **Must have** | What `@docs.page/cli` is for and what each command does conceptually. Link to CLI reference for flags. (`cli-init`, `cli-preview`, `cli-check`, `cli-agent-create`, `cli-agent-delete`) |

#### Organize

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Sidebar | Explanation | **Must have** | How sidebar navigation is modelled: nested groups, pages, flat vs locale-keyed shapes. (`config-sidebar`) |
| Tabs | Explanation | **Must have** | How top-level tabs partition the site and scope sidebars. (`config-tabs`) |
| Links | Explanation | **Should have** | What anchor shortcuts are and where they appear in the chrome. (`config-anchors`) |
| Locales | Explanation | **Should have** | How multi-locale docs are derived from sidebar locale keys and resolved from the URL. (`locales`) |
| Redirects | Explanation | **Should have** | How frontmatter redirects preserve URLs when pages move. (`redirects`) |
| Search | Explanation | **Must have** | How on-site search is built and surfaced in the command palette. (`docs-search`) |

#### Customize

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Theme | Explanation | **Must have** | How theming works: presets, light/dark, colors, fonts. Link to docs.json reference for fields. (`config-theme`) |
| Logo | Explanation | **Must have** | How logos and favicons are resolved for light and dark mode. (`config-logo`) |
| Header | Explanation | **Should have** | What the site header controls and how chrome options interact. (`config-header`) |
| Social links | Explanation | **Should have** | Social profiles and Open Graph behaviour in site chrome. (`config-social`) |
| Vanity subdomains | Explanation | **Should have** | `{owner}.docs.page` routing vs default path URLs. (`vanity-subdomains`) |
| Custom domains | Explanation + How-to | **Should have** | How custom domains map to hosted repos. Short **Enable it**: DNS and worker expectations. (`custom-domains`) |

#### Configure

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Global variables | Explanation | **Should have** | Why and how mustache placeholders substitute values from `docs.json`. (`config-variables`) |
| Table of contents | Explanation | **Should have** | How the on-page TOC is built and what `content.headerDepth` controls. (`table-of-contents`) |
| Navigation buttons | Explanation | **Should have** | How previous/next links are inferred from sidebar order vs frontmatter overrides. (`previous-next`, `config-content`) |
| Search engine indexing | Explanation | **Should have** | What `seo.noindex` does and when to block indexing. (`config-seo`) |

#### AI

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| llms.txt | Explanation | **Must have** | What llms.txt exports are, how they are generated, and why agents use them. (`llms-txt`, `llms-full-txt`) |
| MCP server | Explanation + How-to | **Must have** | What the per-repo MCP endpoint exposes. Short **Enable it**: toggle in `docs.json`, connect a client. (`mcp-server`, `config-mcp`) |
| Agent skills | Explanation + How-to | **Should have** | How `.agents/skills/**` files become MCP resources. Short **Enable it**: repo layout and MCP access. (`mcp-skills`) |
| Ask AI | Explanation + How-to | **Should have** | What the in-docs chat panel does and how it relates to repo content. Short **Enable it**: `docs agent create` and `agent` config. Beta. (`ai-chat`, `config-agent`) |

#### Integrate

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Analytics | Explanation | **Should have** | How analytics scripts are injected and which providers are supported. (`config-analytics`) |
| GitHub App | Explanation + How-to | **Must have** | What PR preview comments do and how they tie to ref routing. Short **Enable it**: install the GitHub App. (`github-bot`) |

**Features writing order:** Overview (done) → Publish pages (`github-hosting` done) → Organize → Customize → Configure → AI → Integrate. Use Explanation layout; link to Reference instead of duplicating field tables.

### Getting Started

Orient, achieve first publish, then pick a page layout for the kind of documentation you are writing — all under one top-level nav group.

**Nav structure:** `Getting Started` → `Introduction` · `Publish your first site` · `Templates` → …

#### Pages

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Introduction | Explanation | **Must have** | Explain what docs.page is, who it is for, and the "docs for humans + agents" value proposition. Summarise hosting at a high level; link to **Public GitHub hosting** on the Features tab for URL patterns and public-repos-only detail. |
| Publish your first site | Tutorial | **Must have** | Walk through first publish: `docs init` or manual scaffold, `docs preview` to verify locally, push to a public repo, open the live URL. Link to **CLI** and **Local preview** on Features; link to **Project structure** in Core concepts; keep the tutorial narrative-focused. |

#### Templates

Nested subgroup under Getting Started — immediately after first publish, when contributors ask *what kind of page am I writing?* These pages describe Diátaxis page layouts (goal, tone, and recommended sections), not docs.page mechanics (those follow in **Authoring content**).

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Tutorial template | Tutorial | **Should have** | Learning-oriented layout: narrative, hands-on steps toward one clear thing to accomplish that builds a mental model. Encouraging and instructional — no choices or deep explanations. Sections: Introduction, Prerequisites, Step-by-step instructions, Next steps. |
| How-to template | How-to | **Should have** | Task-oriented layout for readers who know the basics and need to solve a specific problem. Practical and scannable. Sections: Goal or scenario, Implementation steps, Verification. |
| Reference template | Reference | **Should have** | Lookup-oriented layout for facts, API specs, config keys, or command syntax. Stark, literal, and dense. Sections: Syntax or blueprint, Parameters or options table, Examples. |
| Explanation template | Explanation | **Should have** | Understanding-oriented layout for background, architecture, intent, and design decisions — answers *why*, not just *how*. Discursive and educational. Sections: The concept, How it works, Design decisions. |

### Core concepts

Bottom-up explanations of how docs.page works. **Write these first** — Authoring content, Getting Started tutorials, and Customize pages link here rather than re-explaining mechanics. Diátaxis type is mostly Explanation; some pages include short Reference-style tables where helpful.

**Consolidation policy:** Include all Must, Should, and Could have pages below even when content may later move into Authoring, Customize, Components, or Reference. Mark temporary pages in prose with a note pointing to their eventual home; remove or redirect once the destination page owns the content.

**Nav structure:** `Core concepts` → `Project structure` · `GitHub hosting` · `Content pages` · `Configuration` · `Navigation` · `CLI` · `Previews` · `Search` · `Locales` · `Redirects` · `Variables`

#### Must have

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Project structure | Explanation | **Must have** | What lives in a docs.page repo: `docs.json` (or `docs.yaml`), `docs/**/*.mdx`, repo-relative assets, and how file paths map to URLs. Foundation for every other concept page. |
| GitHub hosting | Explanation | **Must have** | How docs.page serves documentation from a public GitHub repository: default branch as production, `docs.page/owner/repo` URL patterns, push-to-publish model, and public-repos-only constraint. Introduction and **Publish your first site** link here for hosting mechanics. |
| Content pages | Explanation | **Must have** | How a documentation page works: Markdown/MDX, frontmatter metadata, internal links, and repo-relative image paths. **Write documentation** (Authoring) cherry-picks from here; component usage links to the **Components** section. |
| Configuration | Explanation | **Must have** | What `docs.json` controls conceptually — site identity, theme, content behaviour, scripts — without exhaustively listing every field. Sidebar and tabs are summarised here; detail in **Navigation**. Link to **docs.json reference** for lookup. |
| CLI | Explanation | **Must have** | What `@docs.page/cli` is, how to run it (`npx`, global install), and what each command does at baseline: `init` (scaffold), `preview` (local WebSocket server + hosted `/preview` UI), `check` (link and asset linting — a quality sub-step before push, not a separate workflow stage), `agent` (provision in-docs chat). Cover `--api-url`. Link to **CLI reference** for flags and exit codes. |
| Previews | Explanation | **Must have** | Two preview modes and when each applies: **local** (CLI watches disk, bundles MDX, streams to `docs.page/preview` over WebSocket — [PR #472](https://github.com/invertase/docs.page/pull/472)) vs **shareable** (Git ref routing via `~branch`, `~commit`, `~PR`). Where `docs check` fits: after local preview looks right, before you push. Note v1 local preview limitations (no search, sitemap, agent panel). |

#### Should have

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Navigation | Explanation | **Should have** | How site navigation is modelled: sidebar groups and pages, tabs, anchors, and how they interact with locales. **Organize your navigation** (Authoring) links here. *May later fold into Configuration or Authoring once workflow page is complete.* |
| Search | Explanation | **Should have** | How full-text search works: index built from repository MDX, `search.json` endpoint, and the command-palette UI (⌘K). *May later fold into a Customize or Reference page once those pages cover discoverability end-to-end.* |

#### Could have

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Locales | Explanation | **Could have** | How multi-locale documentation is derived from sidebar locale keys and resolved from the current path. **Translate documentation** (Authoring) links here. *Temporary until Authoring owns locale workflow.* |
| Redirects | Explanation | **Could have** | How `redirect` frontmatter resolves internal and external destinations across routing modes. **Update moved pages** (Authoring) links here. *Temporary until Authoring owns redirect workflow.* |
| Variables | Explanation | **Could have** | How `{{ dotted.path }}` placeholders in MDX are substituted from the `variables` object in `docs.json`. *Temporary until **Variables** reference or Configuration absorbs this.* |

### Authoring content

Workflow-oriented how-tos for contributors after first publish. **Cherry-pick from Core concepts** — keep pages focused on goals and sequence, not re-documenting CLI flags or preview architecture.

**Nav structure:** `Authoring content` → `Write documentation` · `Organize your navigation` · `Previews` → … · `Maintain documentation` → …

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Write documentation | How-to | **Must have** | Help contributors write clear, useful pages: structure, prose, links, code, images, and media. Link to **Content pages** in Core concepts and the **Components** section; keep MDX as implementation detail. |
| Organize your navigation | How-to | **Must have** | Structure the sidebar so readers can find content. Link to **Navigation** and **Configuration** in Core concepts; defer field lookup to **docs.json reference**. |

#### Previews

Nested subgroup — preview before publish. `docs check` is a **sub-step of Previews**, not a peer workflow stage: run it after local preview looks right, before you push for shareable preview.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Local preview | How-to | **Must have** | Workflow for iterating with `docs preview`: run from project root, open the printed URL, edit with live reload. Link to **CLI** and **Previews** in Core concepts for architecture; cover only `--port` and `--no-browser` inline. |
| Check documentation | How-to | **Must have** | Sub-step before push: run `docs check` after local preview, fix link and asset issues, wire into CI. Link to **CLI** and **CLI reference** for severity flags; do not re-explain what `check` validates (that lives in Core concepts → CLI). |
| Shareable preview | How-to | **Must have** | Push a branch, share `~ref` URLs, install the GitHub bot for PR comments. Link to **Previews** in Core concepts for URL patterns. |

#### Maintain documentation

Nested subgroup — ongoing content upkeep after publish: locales and URL stability when pages move or get renamed.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Translate documentation | How-to | **Could have** | Set up multi-locale documentation when teams need translated content. Link to **Locales** in Core concepts. |
| Update moved pages | How-to | **Should have** | Redirect readers when you rename or relocate pages, using frontmatter redirects. Link to **Redirects** in Core concepts; mention `docs check` for validating redirect targets. |

### Customize your site

Goals that come after basic authoring: make the site yours, reachable, and measurable.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Apply your branding | How-to | **Must have** | Match the docs site to your project identity: theme, colors, logo, favicon, header, tabs, and footer links. |
| Connect a custom domain | How-to | **Should have** | Serve documentation on your own domain, including vanity subdomain options and DNS/TLS expectations. |
| Improve search visibility | How-to | **Should have** | Help search engines and readers discover your docs: SEO metadata, sitemap, and robots.txt configuration. Link to **Search** in Core concepts for on-site search behaviour. |
| Track reader engagement | How-to | **Should have** | Add analytics to understand which pages readers visit and how they use your documentation. |

### Components

Rich content building blocks — a dedicated section like Mintlify, separate from config reference.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Components overview | Reference | **Must have** | Introduce the component library: when to use components vs plain Markdown, and links to per-component pages. |
| Accordion | Reference | **Must have** | Expandable panels for progressive disclosure, including accordion groups. |
| Callouts | Reference | **Must have** | Highlight notes, tips, warnings, and other emphasized information. |
| Card | Reference | **Should have** | Visual link containers and grouped card layouts. |
| Code blocks | Reference | **Must have** | Syntax highlighting, titles, line numbers, and copy-to-clipboard behavior. |
| Code group | Reference | **Should have** | Tabbed code examples for multiple languages or variants. |
| Heading | Reference | **Could have** | Custom heading options and anchor link behavior. |
| Icon | Reference | **Should have** | Icons for inline emphasis and navigation cues. |
| Image | Reference | **Must have** | Images with sizing, alt text, and GitHub-hosted asset paths. |
| Property | Reference | **Could have** | Structured parameter-style documentation for APIs and configuration. |
| Steps | Reference | **Must have** | Numbered procedures for tutorials and setup guides. |
| Tabs | Reference | **Must have** | Switchable content panels for platform or option variants. |
| Tweet | Reference | **Could have** | Embedded tweets in documentation pages. |
| Video | Reference | **Could have** | Self-hosted or generic embedded video. |
| YouTube | Reference | **Could have** | Embedded YouTube player. |
| Vimeo | Reference | **Could have** | Embedded Vimeo player. |

### AI agents

Agent-ready surfaces — sequenced after first publish per spec tone guidance.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Agent-ready docs | Explanation | **Must have** | Explain why docs.page exposes llms.txt, MCP, and AI chat, and how agent-ready docs complement normal reading. |
| llms.txt | How-to | **Must have** | Use auto-generated LLM index files (`llms.txt`, `llms-full.txt`) so tools can discover and ingest your documentation. |
| MCP server | How-to | **Must have** | Connect Cursor, Claude, or other MCP clients to search and read docs.page-hosted content. |
| Agent skills | How-to | **Should have** | Expose repository `.agents/skills/**` files as MCP resources for agent workflows. |
| AI chat | How-to | **Should have** | Enable and configure the in-docs chat panel for readers who want answers while browsing. |
| Embed a docs assistant | How-to | **Could have** | Integrate a docs-aware chat assistant into your own product using the agent HTTP APIs. |

### Platform comparisons

Product comparisons for evaluation and SEO — no migration guides in v1.

**Nav structure:** `Platform comparisons` → `Compare platforms` → …

#### Compare platforms

Nested subgroup — peer product comparison pages. Sidebar labels use competitor names; page titles stay `docs.page vs …` for SEO.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Mintlify | Explanation | **Must have** | Side-by-side comparison on Git-only vs web editor, zero-config hosting vs dashboard deploys, open source vs SaaS, shared patterns, and feature gaps. |
| Docusaurus | Explanation | **Should have** | Compare instant GitHub hosting to a static-site generator with build and deploy setup. |
| docsify | Explanation | **Should have** | Compare hosted docs.page to client-side docsify with manual hosting. |
| Jekyll | Explanation | **Should have** | Compare docs.page to Jekyll-based documentation workflows. |
| GitHub Pages | Explanation | **Should have** | Compare docs.page to serving documentation through GitHub Pages. |

### Reference

Lookup for configuration fields, page metadata, CLI commands, and HTTP endpoints — not workflow guides.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| docs.json reference | Reference | **Must have** | Complete field reference for site configuration: types, defaults, and valid values. |
| Page frontmatter | Reference | **Must have** | Exhaustive lookup for per-page YAML fields: title, description, redirects, previous/next overrides, and SEO fields. |
| CLI reference | Reference | **Must have** | Flag and exit-code lookup: `docs init`, `docs preview`, `docs check`, `docs agent create`, `docs agent delete`. Conceptual coverage lives in **Core concepts → CLI**; workflow sequencing lives in **Authoring content → Previews**. |
| HTTP endpoints | Reference | **Must have** | Lookup for published routes: `llms.txt`, `llms-full.txt`, MCP, `search.json`, `schema.json`, bundle/chat/agent APIs, sitemap, robots.txt, and raw markdown URLs. |
| Analytics providers | Reference | **Could have** | Supported analytics integration keys and config shapes. |
| Variables | Reference | **Could have** | `{{ dotted.path }}` substitution syntax and config object structure. Conceptual overview lives in **Core concepts → Variables** until consolidated. |
| Search index | Reference | **Could have** | How `search.json` is built and what content is indexed for the command-palette search UI. Conceptual overview lives in **Core concepts → Search** until consolidated. |
| Platform architecture | Reference | **Could have** | High-level overview of GitHub fetch, MDX bundling, routing modes, and request lifecycle — optional reading for those who want internals context. |

**Deferred (not in sitemap):** Preview internals, routing internals, self-hosting, migration guides — Won't have per spec and author feedback.

---

## 4. Self-review

**Does this give the audience everything they need, whilst keeping the docs simple?**

Yes, with revision 3.1.0 applied:

- **Features tab:** every page is **Explanation**; seven pages add a short **Enable it** section (Explanation + How-to) for one-time setup only.
- **Documentation tab:** tutorials and how-tos (Getting Started, Authoring, Customize your site).
- **Reference tab:** field lookup, CLI flags, HTTP endpoints — not duplicated on Features.
- **Separation of concerns:** Features build understanding; Documentation guides workflows; Reference and Components hold lookup depth.
- **Title rule maintained** on outline rows.
- **One feature page written** (`Public GitHub hosting`); remaining stubs follow Explanation layout.

**Writing order:** Features Publish (finish stubs) → Organize → … → Documentation tab workflows as needed.

---

## 5. Author review prompt

**Pending review** — revision 3.1.0: Features pages are **Explanation** only (optional **Enable it** for setup).

**Feature page type rule:**

```
Features tab     → Explanation ( + short Enable it when setup is required )
Documentation tab → Tutorial, How-to, Authoring workflows
Reference tab    → Reference lookup
Components tab   → Reference (per-component props)
```

**Features (27 pages + overview):**

```
Overview
Publish       github-hosting ✓ · components · local-preview · branch-preview · cli
Organize      sidebar · tabs · links · locales · redirects · search
Customize     theme · logo · header · social-links · vanity-subdomains · custom-domains
Configure     global-variables · table-of-contents · navigation-buttons · search-engine-indexing
AI            llms.txt · mcp-server · agent-skills · ask-ai
Integrate     analytics · github-app
```

**Section map:**

```
Features                 ← capability catalog (this revision)
Getting Started
Core concepts            ← write first on Documentation tab
Authoring content
Customize your site
Components
AI agents
Platform comparisons
Reference
```

Once approved, proceed with [docs-write](../.agents/skills/docs-write/SKILL.md) — **Features → Publish** stubs first (after `github-hosting`), then Organize through Integrate.
