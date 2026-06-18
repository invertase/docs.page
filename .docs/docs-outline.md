---
version: "4.0.0"
updatedAt: 2026-06-18
status: approved
---

# Documentation outline

## 1. Audience mental model

This outline serves **contributors** — developers who publish and maintain documentation for their users (product teams, open-source maintainers, SDK authors). Secondary readers include **end-users** who consume published docs and **integrators** who wire docs.page into agents and tooling.

The mental model to build: **docs.page is docs-as-code with no hosting setup**. You add a `docs.json` and pages to a public GitHub repo; docs.page serves them instantly at a live URL. The same site is readable by humans and discoverable by agents via llms.txt, MCP, and Ask AI — without a separate build pipeline, dashboard, or paid tier. Configuration lives in Git; customization is declarative.

**Four top-level tabs:**

1. **Documentation** — journey-ordered guides: Getting Started, Authoring, Customize, Agents, Comparisons.
2. **Features** (`/features`) — goal-ordered capability catalog: **Publish → Organize → Customize → Configure → AI → Integrate**. One **Explanation** page per capability. Short **Enable it** sections only when setup is required; procedural depth lives on the Documentation tab.
3. **Components** (`/components`) — per-component **Reference** lookup.
4. **Reference** (`/reference`) — config fields, CLI flags, HTTP endpoints, and editorial page templates (interim).

**Two-layer model:**

1. **Features tab** — what each capability is and how it behaves (Explanation). Authoring and Customize pages link here for mechanics instead of a separate Core concepts section on Documentation.
2. **Documentation tab** — workflow-oriented how-tos: _when_ and _in what order_. Thin on architecture, rich on procedure.

**Contributor loop (Authoring):** **Write** → **Organise** → **Preview** (local) → **Publish** (remote) → **Manage** (occasional).

**Nav title rule:** Sidebar leaf labels are **2–4 words** (~24 characters). Page `title` in frontmatter may be longer for SEO; `docs.json` sidebar `title` controls nav labels.

---

## 2. Competitor analysis

### Mintlify (primary competitor)

| Mintlify section                                  | Pattern                                                         | docs.page adaptation                                                                                                              |
| ------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Get started** (Introduction, Quickstart)        | Short orient + hands-on first publish                           | **Getting Started**: Introduction + Quickstart only — slim, no nested templates                                                   |
| **Create** (Format text, code, images, redirects) | Writing-oriented how-tos, not "MDX" framing                     | **Authoring → Write** uses content-writing language; MDX is implementation detail in prose                                        |
| **Organize** (Navigation, pages, settings)        | Split across many config pages                                  | **Features → Organize** for the model; **Authoring → Organise** for workflow; field lookup in **docs.json reference**             |
| **Components**                                    | Dedicated top-level section with overview + per-component pages | **Components tab** — separate from config/API reference                                                                         |
| **Customize** (Themes, custom domain, fonts)      | Appearance goals                                                | **Customize** — Branding, Custom domain, SEO, Analytics as goal-oriented how-tos                                                 |
| **Deploy** (GitHub, previews, monorepo)           | Heavy infra section                                             | **Authoring → Preview** (local) and **Publish** (remote); no deploy dashboard docs                                              |
| **CLI**                                           | Dedicated CLI section                                           | **Features → CLI** explains commands; **CLI reference** holds flags; **Authoring → Preview/Publish** hold workflows             |
| **Editor** (web WYSIWYG)                          | Major differentiator                                            | **Omit** — note in product comparisons                                                                                            |
| **AI-native / Assistant / Agent**                 | Large AI section                                                | **Features → AI** for Explanation; **Agents** on Documentation tab for setup how-tos                                               |
| **API playground** (OpenAPI)                      | Entire vertical                                                 | **Omit** — note in comparisons                                                                                                    |
| **Migration**                                     | Dedicated migration hub                                         | **Defer** — comparisons only for v1                                                                                               |
| **Guides** (help center, API docs, content types) | Editorial patterns by documentation type                        | **Reference → Page templates** (interim graveyard) — Diátaxis layouts for contributors; placement TBD                             |

**Key adaptations vs Mintlify:** Journey-ordered Documentation tab, dedicated Features capability catalog, Write/Organise/Preview/Publish/Manage authoring spine, Components and Reference as separate tabs, slim Getting Started.

### Other equivalents (brief)

- **Docusaurus / docsify / Jekyll / GitHub Pages:** Static-site or build-and-host workflows. Contrast with instant GitHub publish; cover in **Comparisons** as peer product pages, not migration how-tos.
- **ReadMe / GitBook:** Hosted platforms with proprietary editors. Position docs.page as open-source, Git-native, and agent-ready by default.

---

## 3. The sitemap

### Tab and page-type rules

| Tab            | Primary Diátaxis types                          | Role                                      |
| -------------- | ----------------------------------------------- | ----------------------------------------- |
| Documentation  | Tutorial, How-to, Explanation (overview pages)  | Workflows and journeys                    |
| Features       | Explanation (+ short Enable it when needed)     | Capability catalog — what and how it works |
| Components     | Reference                                       | Per-component props and usage             |
| Reference      | Reference                                       | Field lookup, endpoints, editorial templates |

### Features

Goal-ordered capability catalog on the **Features** tab (`docs/features/index.mdx`). **Page type: Explanation** for every feature page. Link out to Reference and Components for field-level lookup; link to Documentation tab for multi-step workflows.

**Layout:** Overview → How it works → Enable it (if needed) → Related.

**Nav structure:** `Features` → `Overview` · `Publish` · `Organize` · `Customize` · `Configure` · `AI` · `Integrate`

#### Overview

| Page Title | Diátaxis Type | Priority      | Purpose                                                                                                                                 |
| ---------- | ------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Features   | Explanation   | **Must have** | Card overview of every hosted capability grouped by contributor goal. Cross-link to Components, Reference, and Quickstart. **Written.** |

#### Publish

| Page Title            | Diátaxis Type        | Priority      | Purpose                                                                                                                                                          |
| --------------------- | -------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public GitHub hosting | Explanation          | **Must have** | How push-to-publish works from a public repo: default branch URLs, request-time bundling, public-repos-only. (`github-hosting`) — **written.**                   |
| Components            | Explanation          | **Must have** | What built-in MDX components are, why no imports are needed, and when to use them vs plain Markdown. Link to Components tab for props. (`mdx-components`)           |
| Local preview         | Explanation + How-to | **Must have** | How local preview fits the publish loop; WebSocket + `docs.page/preview` architecture. Short **Enable it**: run `docs preview`. (`local-preview`, `cli-preview`) |
| Branch preview        | Explanation          | **Must have** | Shareable `~ref` URLs for branches, commits, and pull requests — routing model and when to use vs local preview. (`ref-previews`)                                |
| CLI                   | Explanation          | **Must have** | What `@docs.page/cli` is for and what each command does conceptually. Link to CLI reference for flags. (`cli-init`, `cli-preview`, `cli-check`, `cli-agent-*`)   |

#### Organize

| Page Title | Diátaxis Type | Priority        | Purpose                                                                                                   |
| ---------- | ------------- | --------------- | --------------------------------------------------------------------------------------------------------- |
| Sidebar    | Explanation   | **Must have**   | How sidebar navigation is modelled: nested groups, pages, flat vs locale-keyed shapes. (`config-sidebar`) |
| Tabs       | Explanation   | **Must have**   | How top-level tabs partition the site and scope sidebars. (`config-tabs`)                                 |
| Links      | Explanation   | **Should have** | What anchor shortcuts are and where they appear in the chrome. (`config-anchors`)                         |
| Locales    | Explanation   | **Should have** | How multi-locale docs are derived from sidebar locale keys and resolved from the URL. (`locales`)         |
| Redirects  | Explanation   | **Should have** | How frontmatter redirects preserve URLs when pages move. (`redirects`)                                    |
| Search     | Explanation   | **Must have**   | How on-site search is built and surfaced in the command palette. (`docs-search`)                          |

#### Customize

| Page Title        | Diátaxis Type        | Priority        | Purpose                                                                                                         |
| ----------------- | -------------------- | --------------- | --------------------------------------------------------------------------------------------------------------- |
| Theme             | Explanation          | **Must have**   | How theming works: presets, light/dark, colors, fonts. Link to docs.json reference for fields. (`config-theme`) |
| Logo              | Explanation          | **Must have**   | How logos and favicons are resolved for light and dark mode. (`config-logo`)                                    |
| Header            | Explanation          | **Should have** | What the site header controls and how chrome options interact. (`config-header`)                                |
| Social links      | Explanation          | **Should have** | Social profiles and Open Graph behaviour in site chrome. (`config-social`)                                       |
| Vanity subdomains | Explanation          | **Should have** | `{owner}.docs.page` routing vs default path URLs. (`vanity-subdomains`)                                          |
| Custom domains    | Explanation + How-to | **Should have** | How custom domains map to hosted repos. Short **Enable it**: DNS and worker expectations. (`custom-domains`)    |

#### Configure

| Page Title             | Diátaxis Type | Priority        | Purpose                                                                                                               |
| ---------------------- | ------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Global variables       | Explanation   | **Should have** | Why and how mustache placeholders substitute values from `docs.json`. (`config-variables`)                            |
| Table of contents      | Explanation   | **Should have** | How the on-page TOC is built and what `content.headerDepth` controls. (`table-of-contents`)                           |
| Navigation buttons     | Explanation   | **Should have** | How previous/next links are inferred from sidebar order vs frontmatter overrides. (`previous-next`, `config-content`) |
| Search engine indexing | Explanation   | **Should have** | What `seo.noindex` does and when to block indexing. (`config-seo`)                                                    |

#### AI

| Page Title   | Diátaxis Type        | Priority        | Purpose                                                                                                                                                             |
| ------------ | -------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| llms.txt     | Explanation          | **Must have**   | What llms.txt exports are, how they are generated, and why agents use them. (`llms-txt`, `llms-full-txt`)                                                           |
| MCP server   | Explanation + How-to | **Must have**   | What the per-repo MCP endpoint exposes. Short **Enable it**: toggle in `docs.json`, connect a client. (`mcp-server`, `config-mcp`)                                  |
| Agent skills | Explanation + How-to | **Should have** | How `.agents/skills/**` files become MCP resources. Short **Enable it**: repo layout and MCP access. (`mcp-skills`)                                                 |
| Ask AI       | Explanation + How-to | **Should have** | What the in-docs chat panel does and how it relates to repo content. Short **Enable it**: `docs agent create` and `agent` config. Beta. (`ai-chat`, `config-agent`) |

#### Integrate

| Page Title | Diátaxis Type        | Priority        | Purpose                                                                                                                  |
| ---------- | -------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Analytics  | Explanation          | **Should have** | How analytics scripts are injected and which providers are supported. (`config-analytics`)                               |
| GitHub App | Explanation + How-to | **Must have**   | What PR preview comments do and how they tie to ref routing. Short **Enable it**: install the GitHub App. (`github-bot`) |

### Getting Started

Orient and achieve first publish — no nested subgroups.

**Nav structure:** `Getting Started` → `Introduction` · `Quickstart`

| Page Title   | Nav label    | Diátaxis Type | Priority      | Purpose                                                                                                                                                                                                                       |
| ------------ | ------------ | ------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Introduction | Introduction | Explanation   | **Must have** | What docs.page is, who it is for, and the "docs for humans + agents" value proposition. Link to **Public GitHub hosting** on Features for URL patterns. **Written.**                                                          |
| Quickstart   | Quickstart   | Tutorial      | **Must have** | First publish: `docs init` or manual scaffold, `docs preview`, push to a public repo, open the live URL. Link to **CLI**, **Local preview** on Features, and **Authoring → Preview/Publish** for the ongoing loop. **Written.** |

### Authoring

Workflow-oriented how-tos for contributors after first publish. Link to **Features** for mechanics and **Reference** for field lookup — do not re-document architecture or CLI flag tables here.

**Nav structure:** `Authoring` → `Write` · `Organise` · `Preview` · `Publish` · `Manage` → …

**Five workflow concepts:**

| Concept   | Question it answers              | Scope boundary                          |
| --------- | -------------------------------- | --------------------------------------- |
| Write     | What goes on the page?           | Content creation                        |
| Organise  | Where does it live in the nav?   | Sidebar and tabs in `docs.json`         |
| Preview   | Is this ready on my machine?     | **All local actions**                   |
| Publish   | How do reviewers see it on GitHub? | **All remote actions**                |
| Manage    | What do I fix later?             | Occasional post-launch tasks — low prominence |

#### Write

| Page Title | Nav label | Path               | Diátaxis Type | Priority      | Purpose |
| ---------- | --------- | ------------------ | ------------- | ------------- | ------- |
| Write      | Write     | `/authoring/write` | How-to        | **Must have** | Help contributors write clear, useful pages: structure, prose, internal links, code, images, and media. Link to **Components** tab and **Features → Components**; keep MDX as implementation detail. Do not include Diátaxis template pages — those live on Reference (interim). |

**Content sections to include:** Before you begin · Page structure and prose · Links and assets · When to use components · Related.

#### Organise

| Page Title | Nav label | Path                  | Diátaxis Type | Priority      | Purpose |
| ---------- | --------- | --------------------- | ------------- | ------------- | ------- |
| Organise   | Organise  | `/authoring/organise` | How-to        | **Must have** | Structure the sidebar so readers can find content: groups, nested pages, tabs, and ordering. Link to **Features → Sidebar**, **Tabs**, and **Links**; defer field lookup to **docs.json reference**. |

**Content sections to include:** Before you begin · Add pages to the sidebar · Use tabs · Verify navigation · Related.

#### Preview

| Page Title | Nav label | Path                 | Diátaxis Type | Priority      | Purpose |
| ---------- | --------- | -------------------- | ------------- | ------------- | ------- |
| Preview    | Preview   | `/authoring/preview` | How-to        | **Must have** | **All local actions** before `git push`. End with a handoff link to **Publish**. |

**Content scope (local only):**

1. **`docs preview`** — start the server, open the preview URL, live reload while editing, common flags (`--port`, `--no-browser`), troubleshooting.
2. **`docs check`** — run locally from project root, fix link/asset/redirect-target issues, tune severity flags inline.
3. **When to stop** — clean local check; ready to push.

**Link out (do not duplicate):** [Local preview](/features/local-preview), [CLI](/features/cli), [CLI reference](/reference/cli-reference) for full flag tables.

**Do not include:** `git push`, branch `~ref` URLs, GitHub App, GitHub Actions — those belong on **Publish**.

#### Publish

| Page Title | Nav label | Path                  | Diátaxis Type | Priority      | Purpose |
| ---------- | --------- | --------------------- | ------------- | ------------- | ------- |
| Publish    | Publish   | `/authoring/publish`  | How-to        | **Must have** | **All remote actions** after you leave your machine. Start with push; assume local preview and check are done. |

**Content scope (remote only):**

1. **Push** — commit and push your branch to GitHub.
2. **Branch previews** — build and share `~ref` URLs; verify branch content loads correctly.
3. **PR preview comments** — install the GitHub App (one-time), confirm automatic preview links on pull requests.
4. **CI** — run `docs check` in GitHub Actions on every PR or push (full workflow YAML, monorepo `[path]`, `--external-links warn` for flaky CI).
5. **Merge** — brief note that merging to the default branch updates production (no separate deploy step).

**Link out (do not duplicate):** [Branch preview](/features/branch-preview), [GitHub App](/features/github-app), [Public GitHub hosting](/features/github-hosting).

**Do not include:** `docs preview`, running check in a local terminal — those belong on **Preview**.

#### Manage

Nested subgroup — infrequent post-launch tasks. Do not promote from Introduction or Quickstart; cross-link only where relevant.

| Page Title     | Nav label      | Path                          | Diátaxis Type | Priority        | Purpose |
| -------------- | -------------- | ----------------------------- | ------------- | --------------- | ------- |
| Redirects | Redirects | `/authoring/redirects`   | How-to        | **Should have** | Redirect readers when you rename or relocate pages using frontmatter `redirect` stubs. Link to **Features → Redirects** and **Page frontmatter** reference; mention `docs check` for validating redirect targets. |
| Locales   | Locales   | `/authoring/locales`        | How-to        | **Could have**  | Set up multi-locale documentation when teams need translated content. Link to **Features → Locales** and **Organise**. |

### Customize

Goal-oriented how-tos after basic authoring. Link to matching **Features** pages for mechanics.

**Nav structure:** `Customize` → `Branding` · `Custom domain` · `SEO` · `Analytics`

| Page Title                | Nav label     | Diátaxis Type | Priority        | Purpose                                                                                                                                                    |
| ------------------------- | ------------- | ------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apply your branding       | Branding      | How-to        | **Must have**   | Match the docs site to your project identity: theme, colors, logo, favicon, header, tabs, and footer links. Link to **Features → Customize**.              |
| Connect a custom domain   | Custom domain | How-to        | **Should have** | Serve documentation on your own domain, including vanity subdomain options and DNS/TLS expectations. Link to **Features → Custom domains**.                |
| Improve search visibility | SEO           | How-to        | **Should have** | Help search engines discover your docs: SEO metadata, sitemap, and robots.txt. Link to **Features → Search engine indexing** and **Search**.             |
| Track reader engagement   | Analytics     | How-to        | **Should have** | Add analytics to understand which pages readers visit. Link to **Features → Analytics** and **Analytics providers** reference.                           |

### Agents

Agent-ready setup how-tos — sequenced after first publish. **Features → AI** holds Explanations; this section holds procedures only.

**Nav structure:** `Agents` → `Overview` · `llms.txt` · `MCP client` · `Agent skills` · `AI chat` · `Embed assistant`

| Page Title             | Nav label       | Diátaxis Type | Priority        | Purpose                                                                                                               |
| ---------------------- | --------------- | ------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Agent-ready docs       | Overview        | Explanation   | **Must have**   | Why docs.page exposes llms.txt, MCP, and AI chat, and how agent-ready docs complement normal reading. Bridge page.    |
| llms.txt               | llms.txt        | How-to        | **Must have**   | Use auto-generated LLM index files so tools can discover and ingest your documentation. Link to **Features → llms.txt**. |
| MCP server             | MCP client      | How-to        | **Must have**   | Connect Cursor, Claude, or other MCP clients. Link to **Features → MCP server**.                                      |
| Agent skills           | Agent skills    | How-to        | **Should have** | Expose repository `.agents/skills/**` files as MCP resources. Link to **Features → Agent skills**.                    |
| AI chat                | AI chat         | How-to        | **Should have** | Enable and configure the in-docs chat panel. Link to **Features → Ask AI**.                                           |
| Embed a docs assistant | Embed assistant | How-to        | **Could have**  | Integrate a docs-aware chat assistant into your own product using the agent HTTP APIs.                                  |

### Comparisons

Product comparisons for evaluation and SEO — no migration guides in v1.

**Nav structure:** `Comparisons` → `Platforms` → …

| Page Title   | Diátaxis Type | Priority        | Purpose                                                                                                                                              |
| ------------ | ------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mintlify     | Explanation   | **Must have**   | Side-by-side comparison on Git-only vs web editor, zero-config hosting vs dashboard deploys, open source vs SaaS, shared patterns, and feature gaps. |
| Docusaurus   | Explanation   | **Should have** | Compare instant GitHub hosting to a static-site generator with build and deploy setup.                                                               |
| docsify      | Explanation   | **Should have** | Compare hosted docs.page to client-side docsify with manual hosting.                                                                                 |
| Jekyll       | Explanation   | **Should have** | Compare docs.page to Jekyll-based documentation workflows.                                                                                         |
| GitHub Pages | Explanation   | **Should have** | Compare docs.page to serving documentation through GitHub Pages.                                                                                     |

### Components (tab)

Per-component **Reference** lookup on the **Components** tab (`/components`).

| Page Title | Diátaxis Type | Priority        | Purpose                                                                                                      |
| ---------- | ------------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| Overview   | Reference     | **Must have**   | Introduce the component library: when to use components vs plain Markdown, and links to per-component pages. |
| Accordion  | Reference     | **Must have**   | Expandable panels for progressive disclosure, including accordion groups.                                    |
| Callouts   | Reference     | **Must have**   | Highlight notes, tips, warnings, and other emphasized information.                                           |
| Card       | Reference     | **Should have** | Visual link containers and grouped card layouts.                                                             |
| Code blocks| Reference     | **Must have**   | Syntax highlighting, titles, line numbers, and copy-to-clipboard behavior.                                   |
| Code group | Reference     | **Should have** | Tabbed code examples for multiple languages or variants.                                                     |
| Heading    | Reference     | **Could have**  | Custom heading options and anchor link behavior.                                                             |
| Icon       | Reference     | **Should have** | Icons for inline emphasis and navigation cues.                                                               |
| Image      | Reference     | **Must have**   | Images with sizing, alt text, and GitHub-hosted asset paths.                                                 |
| Property   | Reference     | **Could have**  | Structured parameter-style documentation for APIs and configuration.                                         |
| Steps      | Reference     | **Must have**   | Numbered procedures for tutorials and setup guides.                                                          |
| Tabs       | Reference     | **Must have**   | Switchable content panels for platform or option variants.                                                   |
| Tweet      | Reference     | **Could have**  | Embedded tweets in documentation pages.                                                                      |
| Video      | Reference     | **Could have**  | Self-hosted or generic embedded video.                                                                       |
| YouTube    | Reference     | **Could have**  | Embedded YouTube player.                                                                                     |
| Vimeo      | Reference     | **Could have**  | Embedded Vimeo player.                                                                                       |

### Reference (tab)

Lookup for configuration fields, page metadata, CLI commands, HTTP endpoints, and editorial templates — not workflow guides.

#### Configuration and API lookup

| Page Title            | Diátaxis Type | Priority       | Purpose                                                                                                                                                                      |
| --------------------- | ------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| docs.json reference   | Reference     | **Must have**  | Complete field reference for site configuration: types, defaults, and valid values.                                                                                          |
| Page frontmatter      | Reference     | **Must have**  | Exhaustive lookup for per-page YAML fields: title, description, redirects, previous/next overrides, and SEO fields.                                                          |
| CLI reference         | Reference     | **Must have**  | Flag and exit-code lookup: `docs init`, `docs preview`, `docs check`, `docs agent create`, `docs agent delete`. Conceptual coverage on **Features → CLI**; workflow sequencing on **Authoring → Preview** and **Publish**. |
| HTTP endpoints        | Reference     | **Must have**  | Lookup for published routes: `llms.txt`, `llms-full.txt`, MCP, `search.json`, `schema.json`, bundle/chat/agent APIs, sitemap, robots.txt, and raw markdown URLs.             |
| Analytics providers   | Reference     | **Could have** | Supported analytics integration keys and config shapes.                                                                                                                      |
| Variables             | Reference     | **Could have** | `{{ dotted.path }}` substitution syntax and config object structure. Conceptual overview on **Features → Global variables**.                                                |
| Search index          | Reference     | **Could have** | How `search.json` is built and what content is indexed. Conceptual overview on **Features → Search**.                                                                        |
| Platform architecture | Reference     | **Could have** | High-level overview of GitHub fetch, MDX bundling, routing modes, and request lifecycle — optional internals reading.                                                          |

#### Page templates (interim)

Editorial guides for Diátaxis page layouts — **not** docs.page product reference. Interim home until placement is decided; do not promote from Getting Started or Authoring nav.

**Nav structure:** `Reference` → `Page templates` → …

| Page Title           | Diátaxis Type | Priority        | Purpose                                                                                                                                                                                                                                                             |
| -------------------- | ------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page templates       | Explanation   | **Could have**  | Index: what these templates are (editorial patterns for your own docs), placement TBD.                                                                                                                                                                              |
| Tutorial template    | Tutorial      | **Could have**  | Learning-oriented layout: narrative, hands-on steps toward one clear objective. Sections: Introduction, Prerequisites, Step-by-step instructions, Next steps.                                                                                                       |
| How-to template      | How-to        | **Could have**  | Task-oriented layout for readers who know the basics. Sections: Goal or scenario, Implementation steps, Verification.                                                                                                                                             |
| Reference template   | Reference     | **Could have**  | Lookup-oriented layout for facts, API specs, config keys, or command syntax. Sections: Syntax or blueprint, Parameters or options table, Examples.                                                                                                                  |
| Explanation template | Explanation   | **Could have**  | Understanding-oriented layout for background and design decisions. Sections: The concept, How it works, Design decisions.                                                                                                                                           |

**Note:** Template pages are not yet in `docs.json` Reference nav; legacy `/templates/*` and `/authoring/write-documentation/*` URLs redirect to `/authoring/write` until template pages are restored under Reference.

**Deferred (not in sitemap):** Self-hosting, migration guides, Core concepts as a Documentation section — Won't have per spec and author feedback.

---

## 4. Self-review

**Does this give the audience everything they need, whilst keeping the docs simple?**

Yes, with revision 4.0.0:

- **Features tab:** Explanation catalog; optional short **Enable it** for one-time setup.
- **Documentation tab:** Getting Started tutorial + Authoring workflow how-tos (Write → Organise → Preview → Publish → Manage) + Customize + Agents + Comparisons.
- **Preview vs Publish:** clear local/remote boundary — no overlapping preview subpages.
- **Manage:** deprioritized edge cases (redirects, locales) — not mixed into daily workflow.
- **No Core concepts on Documentation:** Features tab owns capability explanations.
- **Components and Reference:** separate tabs for lookup depth.
- **Page templates:** interim on Reference, not in Authoring or Getting Started.
- **Nav titles:** short leaf labels (2–4 words).

**Writing order:** Authoring → Preview and Publish (highest workflow value) → Write and Organise → Manage → Customize → Agents how-tos. Features and Components stubs continue in parallel as needed.

---

## 5. Author review prompt

**Approved** — revision 4.0.0: Authoring IA restructured to Write · Organise · Preview · Publish · Manage.

**Section map (live `docs.json`):**

```
Documentation tab
  Getting Started       Introduction · Quickstart
  Authoring             Write · Organise · Preview · Publish · Manage → Redirects · Locales
  Customize             Branding · Custom domain · SEO · Analytics
  Agents                Overview · llms.txt · MCP client · Agent skills · AI chat · Embed assistant
  Comparisons           Platforms → …

Features tab            Overview · Publish · Organize · Customize · Configure · AI · Integrate
Components tab          Overview · Accordion · …
Reference tab           Overview · docs.json · frontmatter · CLI · HTTP · … (+ Page templates when added)
```

Proceed with [docs-write](../.agents/skills/docs-write/SKILL.md) — **Authoring → Preview** and **Publish** first, then Write and Organise.
