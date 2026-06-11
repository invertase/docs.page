---

## version: "1.7.1"
updatedAt: 2026-06-11
sourceSpec: .docs/docs-spec.md
sourceInventory: .docs/docs-inventory.json

# Scaffold plan

Human-reviewable IA plan. **Approve before Phases 2–4 write `docs.json`.**

## Audiences

**Primary:** contributor — developers who write and share documentation (product teams, OSS maintainers, SDK authors).

**Secondary:** end-user (doc consumers), integrator (agent/API consumers).

## IA principle

**Getting Started = first live site.** Orient, publish once, validate — the shortest path to a URL that works. Nothing else.

**Guides = grow the site.** Plan structure, pick archetypes, write pages with components.

**Core Concepts = how docs.page works.** Zero-config capabilities (search, llms.txt, MCP, URLs) plus platform internals for readers who want the mental model.

**Configuration = tune defaults.** Optional `docs.json` fields.

**Advanced = opt in.** Provisioning, DNS, GitHub App, frontmatter overrides, GEO practices.


| Tier            | Question                                            | `docType`               |
| --------------- | --------------------------------------------------- | ----------------------- |
| Getting Started | Does this get my first site live?                   | `tutorial`, `how-to`    |
| Guides          | How do I plan and write content?                    | `how-to`, `explanation` |
| Core Concepts   | How does this work / what's included automatically? | `explanation`           |
| Configuration   | Can I tune this in `docs.json`?                     | `how-to`                |
| Advanced        | Do I need to install, provision, or opt in?         | `how-to`                |


## First success

**Outcome:** Publish a live docs site — add a `docs.json`, push Markdown to a public GitHub repo, and open the live docs.page URL.

**Quickstart cluster:** [Quickstart](#quickstart) → `github-hosting`, `docs-json-config`, `cli-init`, `public-repos-only`, `cli-check`, `local-preview`

## Journey spine

Sidebar group order on the Documentation tab:

1. **Getting Started** — orient → first-success (one tutorial)
2. **Guides** — plan the site → content types → write by archetype
3. **Core Concepts** — built-in features (zero-config) + platform internals
4. **Configuration** — optional `docs.json` tuning
5. **Advanced** — opt-in setup (AI chat, GitHub bot, frontmatter, GEO)
6. **Comparisons** — per-competitor pages + migration guides (SEO)

Mapped `userGoal` ids:


| Group           | Goals                                  |
| --------------- | -------------------------------------- |
| Getting Started | `orient`, `first-success`              |
| Guides          | `author-content`                       |
| Core Concepts   | `orient`, `integrate`, `understand`    |
| Configuration   | `customize`                            |
| Advanced        | `integrate`, `author-content` (opt-in) |
| Comparisons     | `orient`, `first-success` (migrations) |
| Reference tabs  | `lookup`                               |


## Tab strategy


| Tab           | `href`        | Rationale                                                                                                    |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------ |
| Documentation | `/`           | Getting Started, Guides, Core Concepts, Configuration, Advanced, Comparisons, plus `docs.json` reference hub |
| API           | `/api`        | Grouped HTTP/agent endpoint reference for integrators                                                        |
| CLI           | `/cli`        | Commands and programmatic CLI usage                                                                          |
| Components    | `/components` | Per-component MDX reference (exception: always split)                                                        |


Configuration field lookup lives on the root tab as a **reference hub** (`/configuration/reference`) beside customize how-tos.

## Page clusters

### Phase 2 — Spine (Getting Started only)

**Two pages** — Overview plus one end-to-end tutorial. No separate publish page; preview and validate are steps inside Quickstart.

#### Overview

- **Bucket:** spine
- **docType:** explanation
- **userGoal:** orient
- **audience:** contributor, end-user
- **href:** `/`
- **Merges:** `github-hosting`
- **Why merged:** What docs.page is and zero-config GitHub hosting. Tease built-in features (search, llms.txt, MCP) with links to Core Concepts — do not explain them here.
- **Editorial:** Card grid to Quickstart, Guides, Core Concepts, CLI, Components.

#### Quickstart

- **Bucket:** spine
- **docType:** tutorial
- **userGoal:** first-success
- **audience:** contributor
- **href:** `/quickstart`
- **Sidebar title:** Quickstart
- **Page title (H1):** Publish a live docs site
- **Description:** Scaffold `docs.json`, optionally preview locally and run `docs check`, push to a public GitHub repo, and open your docs.page URL.
- **Merges:** `github-hosting`, `docs-json-config`, `cli-init`, `public-repos-only`, `cli-check`, `local-preview`
- **Why merged:** Spec first-success is **one tutorial** — outcome-focused title; GitHub and public-repo details live in the prose, not the nav label.
- **Pairs with:** `/cli/commands`

### Phase 3 — Depth

#### Guides

Plan and write content after the site is live. Archetype table applies across these pages:


| Archetype                | Relevant?        | Notes                                                |
| ------------------------ | ---------------- | ---------------------------------------------------- |
| Product Guide & Tutorial | Yes — primary    | Onboarding, concepts, how-tos                        |
| API & SDK Reference      | Yes — primary    | SDK authors; Components tab, `Property`, code blocks |
| Support Knowledge Base   | Yes              | FAQs, troubleshooting — Accordion, Callouts, search  |
| Product Changelog        | Yes              | Release notes — dated pages, Card groups             |
| Internal Handbook        | Yes, with caveat | Public GitHub repo required                          |


##### Plan your docs site

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** author-content
- **audience:** contributor
- **href:** `/guides/plan-your-docs-site`
- **Merges:** `config-sidebar`, `config-tabs`, `locales`, `docs-json-config`
- **Why merged:** Pick an archetype, sketch an outline, map to `docs.json` sidebar and tabs. Links to Content types and Writing guides.

##### Choose a content type

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** author-content
- **audience:** contributor
- **href:** `/guides/content-types`
- **Merges:** *(editorial — Diátaxis)*
- **Why split:** Archetypes = *what site*; Diátaxis = *what page*. Inspired by [Mintlify content types](https://www.mintlify.com/docs/guides/content-types.md).

##### Write a product guide

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** author-content
- **audience:** contributor
- **href:** `/guides/write/product-guide`
- **Merges:** `config-content`, *(editorial)*
- **Why split:** Product Guide archetype — Steps, Callouts, Tabs, Card groups; MDX starter templates.

##### Write API & SDK reference

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** author-content
- **audience:** contributor
- **href:** `/guides/write/api-sdk-reference`
- **Merges:** `config-content`, *(editorial)*
- **Why split:** API & SDK archetype — `Property`, Code blocks, Code group, Tabs.

##### Write support articles

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** author-content
- **audience:** contributor
- **href:** `/guides/write/support-knowledge-base`
- **Merges:** `config-content`, *(editorial)*
- **Why split:** Support KB archetype — Accordion, Callouts, search-friendly structure. Search is automatic → `/concepts/search`.

##### Write a changelog

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** author-content
- **audience:** contributor
- **href:** `/guides/write/changelog`
- **Merges:** `config-content`, *(editorial)*
- **Why split:** Changelog archetype — Heading hierarchy, Card groups, callout patterns.

##### Write an internal handbook

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** author-content
- **audience:** contributor
- **href:** `/guides/write/internal-handbook`
- **Merges:** `config-content`, `public-repos-only`, *(editorial)*
- **Why split:** Handbook archetype — nested sidebar, prev/next for onboarding; public-repo note.

#### Core Concepts

How docs.page works — **Built-in features** (every site, zero config) and **Platform internals** (mental model, advanced-only).

##### Built-in features (zero-config)

###### Search on your docs site

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** orient
- **audience:** contributor, end-user
- **href:** `/concepts/search`
- **Merges:** `docs-search`, `search-json`
- **Why split:** ⌘K search is automatic — awareness for contributors and readers; `search.json` for integrators in API reference.

###### llms.txt on your docs site

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** integrate
- **audience:** contributor, integrator, end-user
- **href:** `/concepts/llms-txt`
- **Merges:** `llms-txt`, `llms-full-txt`
- **Why split:** Auto-served on every site — what URLs return, how to share, how AI tools use them. No setup.
- **Pairs with:** `/api/llms-txt`

###### MCP on your docs site

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** integrate
- **audience:** contributor, integrator
- **href:** `/concepts/mcp`
- **Merges:** `mcp-server`, `config-mcp`, `mcp-skills`
- **Why split:** MCP on by default — endpoint URL, tools, skills resources, connecting clients. Optional disable → config reference.
- **Pairs with:** `/api/agent-and-mcp`

###### URLs for your docs site

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** orient
- **audience:** contributor
- **href:** `/concepts/urls`
- **Merges:** `vanity-subdomains`, `ref-previews`, `github-hosting`
- **Why merged:** Canonical, vanity, and `~ref` preview URL shapes — all automatic.

##### Platform internals (advanced-only)

###### How docs.page serves from GitHub

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** understand
- **audience:** contributor, integrator
- **href:** `/concepts/github-serving`
- **Merges:** `github-hosting`, `bundle-api`
- **Why merged:** Fetch model, bundling, routing.

###### Advanced routing and redirects

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** understand
- **audience:** contributor
- **href:** `/concepts/routing-and-redirects`
- **Merges:** `redirects`, `ref-previews`
- **Why merged:** Redirect resolution and ref-routing edge cases — deferred from `/advanced/frontmatter`.

#### Configuration

Optional `docs.json` tuning after the site is live. Field lookup → [docs.json reference](#docsjson-configuration-reference).

##### Customize theme and branding

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** customize
- **audience:** contributor
- **href:** `/configuration/theme-and-branding`
- **Merges:** `config-theme`, `config-logo`, `config-header`
- **Why merged:** Theme colors, fonts, logo, favicon, and header chrome are one branding pass.

##### Add analytics and SEO

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** customize
- **audience:** contributor
- **href:** `/configuration/analytics-and-seo`
- **Merges:** `config-analytics`, `config-seo`, `config-social`
- **Why merged:** Tracking scripts, noindex/social preview, and social profile links — same post-publish tuning moment.

##### Configure content display

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** customize
- **audience:** contributor
- **href:** `/configuration/content-display`
- **Merges:** `config-content`, `config-anchors`, `previous-next`
- **Why merged:** TOC depth, image zoom, page chrome, and anchor shortcuts tune rendering globally. **Previous/next links infer from sidebar by default** (`automaticallyInferNextPrevious: true`) — this page covers toggling and site-wide defaults, not enabling prev/next. Frontmatter overrides → `/advanced/frontmatter`.

##### Set up custom domains

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** customize
- **audience:** contributor
- **href:** `/configuration/custom-domains`
- **Merges:** `custom-domains`
- **Why split:** Custom domains require DNS and worker mapping — opt-in setup. Vanity URLs are automatic → `/concepts/urls`.

#### Advanced

Opt-in features — require provisioning, installation, explicit frontmatter, or optional content practices. Per [IA principle](#ia-principle), nothing here works automatically without contributor action.

##### Enable AI chat in your docs

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** integrate
- **audience:** contributor, integrator
- **href:** `/advanced/ai-chat`
- **Merges:** `ai-chat`, `config-agent`, `cli-agent-create`, `cli-agent-delete`
- **Why merged:** Configure chat in `docs.json`, provision credentials via CLI, manage lifecycle.
- **Pairs with:** `/api/agent-and-mcp`

##### Optimize docs for AI search

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** integrate
- **audience:** contributor
- **href:** `/advanced/optimize-for-ai-search`
- **Merges:** `llms-txt`, `config-seo`, *(editorial — GEO practices)*
- **Why split:** Optional contributor practices so AI answer engines cite docs accurately — content structure, titles, and linking. Complements the automatic `llms.txt` URLs (which need no action). Inspired by [Mintlify GEO guide](https://www.mintlify.com/docs/guides/geo.md).
- **Pairs with:** `/concepts/llms-txt`, `/configuration/analytics-and-seo`

##### Install the GitHub bot for PR previews

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** author-content
- **audience:** contributor
- **href:** `/advanced/github-bot`
- **Merges:** `github-bot`
- **Why split:** **Optional** — installs the GitHub App so PR comments include preview links. Preview URLs work without the bot → `/concepts/urls`.

##### Set page metadata with frontmatter

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** author-content
- **audience:** contributor
- **href:** `/advanced/frontmatter`
- **Merges:** `redirects`, `previous-next`
- **Why merged:** **Overrides only** — title, description, prev/next, and redirect frontmatter for power users. Prev/next already work automatically from sidebar order; redirects require explicit frontmatter. Redirect resolution internals → Core Concepts.

#### Comparisons

Separate page per competitor for SEO. Neutral orientation — no superiority claims in titles.

##### docs.page vs Docusaurus

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** orient
- **audience:** contributor
- **href:** `/comparisons/docusaurus`
- **Merges:** *(editorial)*

##### docs.page vs docsify

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** orient
- **audience:** contributor
- **href:** `/comparisons/docsify`
- **Merges:** *(editorial)*

##### docs.page vs Jekyll

- **Bucket:** depth
- **docType:** explanation
- **userGoal:** orient
- **audience:** contributor
- **href:** `/comparisons/jekyll`
- **Merges:** *(editorial)*

##### Migrate from Docusaurus

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** first-success
- **audience:** contributor
- **href:** `/comparisons/migrate-docusaurus`
- **Merges:** *(editorial)*

##### Migrate from docsify

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** first-success
- **audience:** contributor
- **href:** `/comparisons/migrate-docsify`
- **Merges:** *(editorial)*

##### Migrate from Jekyll

- **Bucket:** depth
- **docType:** how-to
- **userGoal:** first-success
- **audience:** contributor
- **href:** `/comparisons/migrate-jekyll`
- **Merges:** *(editorial)*

### Phase 4 — Reference

#### docs.json configuration reference

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** root (`/configuration`)
- **href:** `/configuration/reference`
- **Merges:** `docs-json-config`, `config-sidebar`, `config-theme`, `config-agent`, `config-mcp`, `config-content`, `config-tabs`, `config-header`, `config-logo`, `config-seo`, `config-social`, `config-analytics`, `config-anchors`, `config-variables`
- **Why merged:** Single lookup hub for all `docs.json` fields; customize how-tos link here.

#### API overview

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** api
- **href:** `/api`
- **Merges:** *(section index)*

#### Agent & MCP APIs

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** api
- **href:** `/api/agent-and-mcp`
- **Merges:** `agent-chat-api`, `create-agent-api`, `delete-agent-api`, `mcp-server`, `mcp-skills`
- **Pairs with:** `/advanced/ai-chat`, `/concepts/mcp`

#### llms.txt endpoints

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** api
- **href:** `/api/llms-txt`
- **Merges:** `llms-txt`, `llms-full-txt`
- **Pairs with:** `/concepts/llms-txt`

#### Document and search APIs

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** api
- **href:** `/api/documents`
- **Merges:** `bundle-api`, `raw-markdown`, `search-json`, `docs-search`
- **Why merged:** `search.json`, raw `.md`/`.mdx` URLs, and bundle API are **automatic** — no contributor setup. Reference for integrators; human search awareness → `/concepts/search`.

#### Site metadata APIs

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** api
- **href:** `/api/site-metadata`
- **Merges:** `sitemap`, `robots-txt`, `config-schema`
- **Why merged:** Auto-generated `sitemap.xml` and `robots.txt` per repo (zero config; `seo.noindex` affects robots). Global `/schema.json` for editor/MCP validation. Integrator lookup — awareness on `/concepts/llms-txt` and `/configuration/analytics-and-seo`.

#### CLI overview

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** cli
- **href:** `/cli`
- **Merges:** *(section index)*

#### CLI commands

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** cli
- **href:** `/cli/commands`
- **Merges:** `cli-init`, `cli-check`, `cli-agent-create`, `cli-agent-delete`
- **Pairs with:** `/quickstart`, `/advanced/ai-chat`

#### Programmatic CLI usage

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** cli
- **href:** `/cli/programmatic`
- **Merges:** `cli-api-url`

#### Components overview

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** components
- **href:** `/components`
- **Merges:** *(section index + traceability table)*
- **Pairs with:** `/guides/write/`* archetype guides

#### Component pages (always split)

- **Bucket:** reference
- **docType:** reference
- **userGoal:** lookup
- **tab:** components
- **href:** `/components/{name}` (15 leaves)
- **Merges:** one `component-`* id per page


| Sub-group          | Pages                                | Capability ids                                                                      |
| ------------------ | ------------------------------------ | ----------------------------------------------------------------------------------- |
| Layout & structure | Accordion, Tabs, Steps, Heading      | `component-accordion`, `component-tabs`, `component-steps`, `component-heading`     |
| Content blocks     | Callout, Card, Property              | `component-callout`, `component-card`, `component-property`                         |
| Code & media       | Code blocks, Code group, Image, Icon | `component-code-fence`, `component-code-group`, `component-image`, `component-icon` |
| Embeds             | Tweet, Video, Vimeo, YouTube         | `component-tweet`, `component-video`, `component-vimeo`, `component-youtube`        |


## Omit

Per spec Policy → Omit. No `capabilityIds` on any page.


| Capability id          | Reason                                             |
| ---------------------- | -------------------------------------------------- |
| `platform-analytics`   | Internal platform metrics — admin/operator tooling |
| `health-check`         | Service health probes — operator infrastructure    |
| `custom-domain-lookup` | Internal worker API — operator infrastructure      |


## Defer


| Capability id | Reason                                         |
| ------------- | ---------------------------------------------- |
| *(none)*      | All non-omitted capabilities mapped via merges |


`**config-variables` placement:** Documented only on `/configuration/reference` — the `variables` field in `docs.json` and `{{ dotted.path }}` placeholder syntax. Not a Writing-guide topic unless an archetype page needs a one-line example (e.g. SDK reference reusing a version string).

## Page budget


| Phase     | Planned pages | Notes                                                                                                            |
| --------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| Spine     | 2             | Overview + Quickstart (includes preview, validate, push)                                                         |
| Depth     | 30            | Guides (8) + Core Concepts (6) + Configuration (4) + Advanced (4) + Comparisons (6); config reference in Phase 4 |
| Reference | 25            | 1 config hub + 5 API + 3 CLI + 16 components                                                                     |
| **Total** | **57**        | Phased delivery                                                                                                  |


## Feature classification audit

Cross-check per [IA principle](#ia-principle).

### Zero-config → Core Concepts (built-in features)


| Capability                              | Auto behavior                    | Doc placement                                             |
| --------------------------------------- | -------------------------------- | --------------------------------------------------------- |
| `docs-search`                           | ⌘K search                        | `/concepts/search`                                        |
| `search-json`                           | `search.json` endpoint           | API reference + `/concepts/search`                        |
| `llms-txt`, `llms-full-txt`             | Index + full-text URLs           | `/concepts/llms-txt`                                      |
| `mcp-server`, `mcp-skills`              | MCP on by default                | `/concepts/mcp`                                           |
| `vanity-subdomains`, `ref-previews`     | Alternate + preview URL shapes   | `/concepts/urls`                                          |
| `previous-next`                         | Inferred from sidebar by default | Writing guides + `/concepts/urls`; tuning → Configuration |
| `sitemap`, `robots-txt`, `raw-markdown` | Auto-generated / suffix URLs     | API reference                                             |


### Authoring → Guides


| Topic                               | Doc placement                                          |
| ----------------------------------- | ------------------------------------------------------ |
| Site planning, archetypes, Diátaxis | `/guides/plan-your-docs-site`, `/guides/content-types` |
| Writing by archetype                | `/guides/write/`*                                      |


### Optional tuning → Configuration


| Capability                                          | Requires action  | Doc placement                       |
| --------------------------------------------------- | ---------------- | ----------------------------------- |
| `config-theme`, `config-logo`, `config-header`      | docs.json fields | `/configuration/theme-and-branding` |
| `config-analytics`, `config-seo`, `config-social`   | docs.json fields | `/configuration/analytics-and-seo`  |
| `config-content`, `config-anchors`, `previous-next` | Toggle defaults  | `/configuration/content-display`    |
| `custom-domains`                                    | DNS + mapping    | `/configuration/custom-domains`     |


### Opt-in → Advanced


| Capability                                    | Requires action            | Doc placement                         |
| --------------------------------------------- | -------------------------- | ------------------------------------- |
| `ai-chat`, `config-agent`, CLI agent commands | Provision + configure      | `/advanced/ai-chat`                   |
| `github-bot`                                  | Install GitHub App         | `/advanced/github-bot`                |
| `redirects`, `previous-next` (overrides)      | Frontmatter                | `/advanced/frontmatter`               |
| *(editorial GEO)*                             | Optional content practices | `/advanced/optimize-for-ai-search`    |
| `local-preview`, `cli-check`                  | Contributor workflow       | `/quickstart` (steps inside tutorial) |


### Platform internals → Core Concepts


| Capability                               | Doc placement                     |
| ---------------------------------------- | --------------------------------- |
| `github-hosting`, `bundle-api`           | `/concepts/github-serving`        |
| `redirects`, `ref-previews` (edge cases) | `/concepts/routing-and-redirects` |


## Resolved from review

- **Getting Started:** 2 pages — Overview + one Quickstart tutorial (scaffold, preview, validate, push, live URL).
- **Guides:** Plan, content types, and 5 archetype writing pages moved out of Getting Started.
- **Core Concepts:** Built-in features (search, llms.txt, MCP, URLs) + platform internals — zero-config awareness lives here, not Getting Started.
- **IA principle:** First live site → Getting Started; how it works → Core Concepts; opt-in → Advanced.
- **Comparisons:** Separate page per competitor plus matching migration pages.
- **Section order:** Getting Started → Guides → Core Concepts → Configuration → Advanced → Comparisons.

---

**Checkpoint:** Getting Started is Overview + Quickstart only. Approve to proceed to Phase 2.