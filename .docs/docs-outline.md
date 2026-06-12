---
version: "1.6.0"
updatedAt: 2026-06-12
status: approved
---

# Documentation outline

## 1. Audience mental model

This outline serves **contributors** — developers who publish and maintain documentation for their users (product teams, open-source maintainers, SDK authors). Secondary readers include **end-users** who consume published docs and **integrators** who wire docs.page into agents and tooling.

The mental model to build: **docs.page is docs-as-code with no hosting setup**. You add a `docs.json` and pages to a public GitHub repo; docs.page serves them instantly at a live URL. The same site is readable by humans and discoverable by agents via llms.txt, MCP, and AI chat — without a separate build pipeline, dashboard, or paid tier. Configuration lives in Git; previews come from branch/PR refs; customization is declarative.

---

## 2. Competitor analysis

### Mintlify (primary competitor)

Mintlify is the closest equivalent: MDX content, a root `docs.json` config file, Git-backed publishing, PR preview deployments, built-in search, custom domains, an AI assistant, llms.txt/MCP agent surfaces, and a large component library. Structural patterns worth adopting or adapting:

| Mintlify section | Pattern | docs.page adaptation |
| --- | --- | --- |
| **Get started** (Introduction, Quickstart) | Short orient + hands-on first publish | **Getting Started** with nested **Templates** subgroup after Publish your first site |
| **Create** (Format text, code, images, redirects) | Writing-oriented how-tos, not "MDX" framing | **Write documentation** and related authoring pages use content-writing language; MDX is implementation detail in prose |
| **Organize** (Navigation, pages, settings) | Split across many config pages | Navigation covered in authoring workflow; field lookup deferred to **docs.json reference** |
| **Components** | Dedicated top-level section with overview + per-component pages | **Match:** standalone **Components** section, separate from config/API reference |
| **Customize** (Themes, custom domain, fonts) | Appearance goals | Reframe as user goals: branding, domain, SEO, analytics — not one page per config key |
| **Deploy** (GitHub, previews, monorepo) | Heavy infra section | Fold preview/review into authoring workflow pages; no deploy dashboard docs |
| **CLI** | Dedicated CLI section | **CLI reference** in Reference section only |
| **Editor** (web WYSIWYG) | Major differentiator | **Omit** — note in product comparisons |
| **AI-native / Assistant / Agent** | Large AI section | **AI agents** section; consumer surfaces before integrator APIs |
| **API playground** (OpenAPI) | Entire vertical | **Omit** — note in comparisons |
| **Migration** | Dedicated migration hub | **Defer** — comparisons only for v1 per author feedback |
| **Guides** (help center, API docs, content types) | Editorial patterns by documentation type | Nested **Templates** under Getting Started — Diátaxis page layouts for contributors |

**Key adaptations vs Mintlify:** Journey-ordered spine (not feature silos), goal-driven authoring/customize sections, Components as its own section, slim Getting Started, product comparisons without migration guides for now.

### Other equivalents (brief)

- **Docusaurus / docsify / Jekyll / GitHub Pages:** Static-site or build-and-host workflows. Contrast with instant GitHub publish; cover in **Platform comparisons** as peer product pages, not migration how-tos.
- **ReadMe / GitBook:** Hosted platforms with proprietary editors. Position docs.page as open-source, Git-native, and agent-ready by default.

---

## 3. The sitemap

### Getting Started

Orient, achieve first publish, then pick a page layout for the kind of documentation you are writing — all under one top-level nav group.

**Nav structure:** `Getting Started` → `Introduction` · `Publish your first site` · `Templates` → …

#### Pages

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Introduction | Explanation | **Must have** | Explain what docs.page is, who it is for, and the "docs for humans + agents" value proposition. Include how hosting works: public GitHub repo → `docs.json` + `docs/**/*.mdx` → live URL, public repos only, and what you do not need (build step, hosting account). |
| Publish your first site | Tutorial | **Must have** | Walk through first success: scaffold with `docs init` or manually, push to a public repo, open the live docs.page URL, and verify the site renders. Cover expected repo layout (`docs.json`, `docs/**/*.mdx`) and how to read your site's URL patterns. |

#### Templates

Nested subgroup under Getting Started — immediately after first publish, when contributors ask *what kind of page am I writing?* These pages describe Diátaxis page layouts (goal, tone, and recommended sections), not docs.page mechanics (those follow in **Authoring content**).

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Tutorial template | Tutorial | **Should have** | Learning-oriented layout: narrative, hands-on steps that give readers an immediate win and build a mental model. Encouraging and instructional — no choices or deep explanations. Sections: Introduction, Prerequisites, Step-by-step instructions, Next steps. |
| How-to template | How-to | **Should have** | Task-oriented layout for readers who know the basics and need to solve a specific problem. Practical and scannable. Sections: Goal or scenario, Implementation steps, Verification. |
| Reference template | Reference | **Should have** | Lookup-oriented layout for facts, API specs, config keys, or command syntax. Stark, literal, and dense. Sections: Syntax or blueprint, Parameters or options table, Examples. |
| Explanation template | Explanation | **Should have** | Understanding-oriented layout for background, architecture, intent, and design decisions — answers *why*, not just *how*. Discursive and educational. Sections: The concept, How it works, Design decisions. |

### Authoring content

Follow the contributor workflow: write → organize → preview → maintain. Pages are ordered by what someone does after their site is live, not by product feature names.

**Nav structure:** `Authoring content` → `Write documentation` · `Organize your navigation` · `Previews` → … · `Maintain documentation` → …

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Write documentation | How-to | **Must have** | Help contributors write clear, useful documentation pages: structure and headings, prose and tone, links, code examples, images, and media. Frame this as content writing; mention MDX only where needed for syntax. |
| Organize your navigation | How-to | **Must have** | Structure the sidebar so readers can find content — page order, groups, tabs, and anchors in `docs.json`. |

#### Previews

Nested subgroup — preview documentation before it goes live. Local for solo iteration; shareable for branch, pull request, and team review links.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Local preview | How-to | **Must have** | Iterate on content and configuration on your machine before pushing, using the CLI and local preview flow. |
| Shareable preview | How-to | **Must have** | Share preview links with teammates via branch or pull request URLs, and install the GitHub bot for automatic preview links. |

#### Maintain documentation

Nested subgroup — ongoing content upkeep after publish: locales and URL stability when pages move or get renamed.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Translate documentation | How-to | **Could have** | Set up multi-locale documentation when teams need translated content. |
| Update moved pages | How-to | **Should have** | Redirect readers when you rename or relocate pages, using frontmatter redirects. |

### Customize your site

Goals that come after basic authoring: make the site yours, reachable, and measurable.

| Page Title | Diátaxis Type | Priority | Purpose |
| --- | --- | --- | --- |
| Apply your branding | How-to | **Must have** | Match the docs site to your project identity: theme, colors, logo, favicon, header, tabs, and footer links. |
| Connect a custom domain | How-to | **Should have** | Serve documentation on your own domain, including vanity subdomain options and DNS/TLS expectations. |
| Improve search visibility | How-to | **Should have** | Help search engines and readers discover your docs: SEO metadata, sitemap, and robots.txt configuration. |
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
| CLI reference | Reference | **Must have** | Commands and flags: `docs init`, `docs check`, `docs agent create`, `docs agent delete`. |
| HTTP endpoints | Reference | **Must have** | Lookup for published routes: `llms.txt`, `llms-full.txt`, MCP, `search.json`, `schema.json`, bundle/chat/agent APIs, sitemap, robots.txt, and raw markdown URLs. |
| Analytics providers | Reference | **Could have** | Supported analytics integration keys and config shapes. |
| Variables | Reference | **Could have** | `{{ dotted.path }}` substitution syntax and config object structure. |
| Search index | Reference | **Could have** | How `search.json` is built and what content is indexed for the command-palette search UI. |
| Platform architecture | Reference | **Could have** | High-level overview of GitHub fetch, MDX bundling, routing modes, and request lifecycle — optional reading for those who want internals context. |

**Deferred (not in sitemap):** Preview internals, routing internals, self-hosting, migration guides — Won't have per spec and author feedback.

---

## 4. Self-review

**Does this give the audience everything they need, whilst keeping the docs simple?**

Yes, with these revisions applied from author feedback:

- **Getting Started trimmed to two pages:** hosting model folded into Introduction; repo layout and URLs folded into Publish your first site.
- **Authoring follows a workflow:** write → organize → preview (local, then shareable) → maintain (redirects, locales). Titles use content-writing language ("Write documentation", not "Write MDX content").
- **Customize follows goals:** branding → domain → discoverability → measurement — not one page per config field.
- **Components is its own section** (Mintlify pattern), separate from Reference.
- **Reference holds lookup only:** config, frontmatter, CLI, HTTP endpoints — not workflow content.
- **Previews** nested under Authoring content — local and shareable preview pages grouped like Templates under Getting Started.
- **Maintain documentation** nested under Authoring content — translate and redirect pages grouped after Previews.
- **Compare platforms** nested under Platform comparisons — peer comparison pages grouped like Templates under Getting Started.
- **Renames applied:** MCP skills → Agent skills; External AI chat → Embed a docs assistant; Docs Guides → Templates (Diátaxis page layouts).
- **Title rule maintained:** each page title names one focus.
- **Templates** nested under Getting Started (child group after Publish your first site) — four Diátaxis layout guides.

**Coverage note:** Feature details for tabs, header links, vanity subdomains, variables, and search are covered within goal-oriented pages or Reference lookups rather than standalone feature pages.

---

## 5. Status

**Approved** — sitemap locked for v1 content writing.

Confirmed structure: **Templates** nested under **Getting Started** (child group after Publish your first site).

**Deferred to v1 planning:** migration guides (Won't have).

**Next step:** [docs-write](../.agents/skills/docs-write/SKILL.md) — draft MDX from this outline when ready.
