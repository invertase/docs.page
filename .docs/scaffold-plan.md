---
version: "3.0.0"
updatedAt: 2026-06-11
sourceSpec: .docs/docs-spec.md
sourceInventory: .docs/docs-inventory.json
---

# Scaffold plan

Persona, journeys, and policy: `.docs/docs-spec.md`

## Nav order

Root tab groups follow spec journey for the **contributor** (primary persona):

| # | Group | Spec journey | Rationale |
| --- | --- | --- | --- |
| 1 | Getting Started | orient, first-success | Short spine — one tutorial to live URL |
| 2 | Guides | author-content | Plan and write before tuning the site |
| 3 | Publishing Docs | customize, integrate | Owner tasks after content exists |
| 4 | Using Docs | _(secondary: end-user, integrator)_ | What consumers do — after publish context |
| 5 | Comparisons | _(SEO, evaluation)_ | Platform choice — last |

**Within Publishing Docs:** share URLs → **Configuration** (customize) → **agent setup** (integrate) → **CLI** (lookup) → **Advanced** (power features). Spec order: customize before integrate.

**Within Using Docs:** search → chat → connect (browse → in-site AI → external AI tools).

**Within Guides:** plan IA → choose type → write archetypes (incremental — no archetype before plan/content-type).

**Reference:** `/configuration/reference` last in Configuration sub-group. **Components** tab separate (`href: /components`).

## Nav

Two tabs: **Documentation** + **Components** catalogue. No API or CLI tabs.

```
Documentation (/)
├── Getting Started [spine]
│   ├── Overview  /
│   └── Quickstart  /quickstart                    → H1: Publish a live docs site
├── Guides [depth]
│   ├── Plan your site  /guides/plan-your-docs-site
│   ├── Choose a content type  /guides/content-types
│   └── Write by doc type [depth]
│       ├── Write a product guide  /guides/write/product-guide
│       ├── Write an API reference  /guides/write/api-sdk-reference
│       ├── Write a knowledge base  /guides/write/support-knowledge-base
│       ├── Write a changelog  /guides/write/changelog
│       └── Write an internal handbook  /guides/write/internal-handbook
├── Publishing docs [depth]
│   ├── Share and preview links  /publishing/urls
│   ├── Configure your site [depth]
│   │   ├── Customize theme and branding  /configuration/theme-and-branding
│   │   ├── Add analytics and SEO  /configuration/analytics-and-seo
│   │   ├── Configure content display  /configuration/content-display
│   │   └── Set up a custom domain  /configuration/custom-domains
│   ├── Enable agent features [depth]
│   │   ├── Enable AI chat  /publishing/agent-ready/ai-chat
│   │   └── Add agent skills  /publishing/agent-ready/skills
│   ├── Use the CLI  /cli
│   └── Advanced [depth]
│       ├── Write for AI search  /advanced/optimize-for-ai-search
│       ├── Install the GitHub bot  /advanced/github-bot
│       └── Set page metadata  /advanced/frontmatter
├── Using docs [depth]
│   ├── Search docs  /using/search
│   ├── Chat with docs  /using/chat
│   └── Connect AI tools  /using/connect
└── Comparisons [depth]
    ├── docs.page vs Docusaurus  /comparisons/docusaurus
    ├── docs.page vs docsify  /comparisons/docsify
    ├── docs.page vs Jekyll  /comparisons/jekyll
    ├── Migrate from Docusaurus  /comparisons/migrate-docusaurus
    ├── Migrate from docsify  /comparisons/migrate-docsify
    └── Migrate from Jekyll  /comparisons/migrate-jekyll

Documentation (/) [ref]
└── docs.json reference  /configuration/reference

Components (/components) [catalogue]
├── Overview  /components
├── Layout & structure [catalogue]
│   ├── Accordion  /components/accordion
│   ├── Tabs  /components/tabs
│   ├── Steps  /components/steps
│   └── Heading  /components/heading
├── Content blocks [catalogue]
│   ├── Callout  /components/callout
│   ├── Card  /components/card
│   └── Property  /components/property
├── Code & media [catalogue]
│   ├── Code blocks  /components/code-fence
│   ├── Code group  /components/code-group
│   ├── Image  /components/image
│   └── Icon  /components/icon
└── Embeds [catalogue]
    ├── Tweet  /components/tweet
    ├── Video  /components/video
    ├── Vimeo  /components/vimeo
    └── YouTube  /components/youtube
```

## Sidebar titles

Per headline-style: **action-first** sidebar labels; bare nouns only for component lookup and neutral comparisons.

| href | Sidebar title | H1 (when different) |
| --- | --- | --- |
| `/` | Overview | What is docs.page? |
| `/quickstart` | Quickstart | Publish a live docs site |
| `/using/search` | Search docs | Search with ⌘K |
| `/using/chat` | Chat with docs | — |
| `/using/connect` | Connect AI tools | Connect MCP and llms.txt |
| `/cli` | Use the CLI | — |
| `/configuration/reference` | docs.json reference | — |
| `/components/*` | Component name | — (Accordion, Tabs, …) |

Group labels: **Publishing docs** / **Using docs** (sentence case, task framing). Sub-groups: **Configure your site**, **Enable agent features**, **Write by doc type**.

## Budget

| Phase | Pages |
| --- | --- |
| Spine | 2 |
| Depth | 30 |
| Reference | 17 |
| **Total** | **47** |

## Merge map

| href | capabilities |
| --- | --- |
| `/` | `github-hosting` |
| `/quickstart` | `github-hosting`, `docs-json-config`, `cli-init`, `public-repos-only`, `cli-check`, `local-preview` |
| `/guides/plan-your-docs-site` | `config-sidebar`, `config-tabs`, `locales`, `docs-json-config` |
| `/guides/content-types` | _(editorial)_ |
| `/guides/write/*` | `config-content`, _(editorial)_ |
| `/publishing/urls` | `vanity-subdomains`, `ref-previews`, `github-hosting` |
| `/configuration/theme-and-branding` | `config-theme`, `config-logo`, `config-header` |
| `/configuration/analytics-and-seo` | `config-analytics`, `config-seo`, `config-social`, `sitemap`, `robots-txt` |
| `/configuration/content-display` | `config-content`, `config-anchors`, `previous-next` |
| `/configuration/custom-domains` | `custom-domains` |
| `/publishing/agent-ready/ai-chat` | `ai-chat`, `config-agent`, `cli-agent-create`, `cli-agent-delete`, `create-agent-api`, `delete-agent-api` |
| `/publishing/agent-ready/skills` | `mcp-skills` |
| `/cli` | `cli-init`, `cli-check`, `cli-agent-create`, `cli-agent-delete`, `cli-api-url` |
| `/advanced/optimize-for-ai-search` | `config-seo`, `docs-search`, _(editorial)_ |
| `/advanced/github-bot` | `github-bot` |
| `/advanced/frontmatter` | `redirects`, `previous-next` |
| `/using/search` | `docs-search`, `search-json` |
| `/using/chat` | `ai-chat`, `agent-chat-api` |
| `/using/connect` | `mcp-server`, `mcp-skills`, `llms-txt`, `llms-full-txt`, `bundle-api`, `raw-markdown` |
| `/comparisons/*` | _(editorial)_ |
| `/configuration/reference` | all `config-*`, `docs-json-config`, `config-schema` |
| `/components/*` | `component-*` |

## Decisions

- **Nav order (v3.0):** Configuration before agent setup (spec customize → integrate). CLI after both; Advanced last within Publishing.
- **Phrasing:** sidebar = reader action; H1 can add detail (`/using/connect` → sidebar "Connect AI tools", H1 "Connect MCP and llms.txt").
- **Two tabs:** Documentation + Components catalogue. No API tab — endpoints inline on `/using/search`, `/using/connect`, `/using/chat`. CLI = `/cli` in Publishing, not a tab.
- **Using docs:** three pages — search, chat, connect. Nav/theme/locales = site chrome; owners configure under Publishing.
- **Agent split:** consume → Using docs; enable/publish → Publishing docs.
- **Components:** Mintlify catalogue — card grid index, preview → example → usage → props (`docType: catalogue`).
- Getting Started stays **2 pages**. Config = 4 how-tos + 1 reference hub.

## Pairs

| guide / concept | reference |
| --- | --- |
| `/quickstart` | `/cli` |
| `/using/chat` | `/publishing/agent-ready/ai-chat` |
| `/using/connect` | `/publishing/agent-ready/skills`, `/configuration/reference` |
| `/publishing/agent-ready/ai-chat` | `/using/chat`, `/cli` |
| `/guides/write/*` | `/components/*` |
| `/guides/content-types` | `/advanced/optimize-for-ai-search` |

## Omit

| id | reason |
| --- | --- |
| `platform-analytics` | spec omit |
| `health-check` | spec omit |
| `custom-domain-lookup` | spec omit |

## Defer

| id | reason |
| --- | --- |
| _(none)_ | All non-omitted capabilities mapped |
