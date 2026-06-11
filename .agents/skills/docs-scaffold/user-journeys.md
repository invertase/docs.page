# User journey spine

Structure the site around **what readers are trying to accomplish**, not how the codebase is organized. Read this **before** clustering capabilities into pages.

**Authoritative source:** When `docs-spec.md` exists, its `## Journeys` section overrides default ordering here. This file defines goal ids and placement rules; [docs-spec](../docs-spec/SKILL.md) defines product-specific priority.

Capability inventories describe machinery. Documentation navigation should describe **tasks and outcomes**.

---

## Primary user goals

Use these goal ids on every `outline.pages` entry as `userGoal`. Pick the **single** goal the page primarily serves.

| `userGoal` | Reader intent | Typical `docType` | Typical placement |
| --- | --- | --- | --- |
| `orient` | Understand what the product is | `explanation` | Overview (landing) |
| `first-success` | Complete one end-to-end win (install, first publish, first API call) | `tutorial` | Getting Started |
| `author-content` | Write, format, and organize pages | `how-to` | Getting Started or Guides |
| `customize` | Change theme, nav, branding, config | `how-to` + `reference` | Configuration |
| `integrate` | Connect via API, SDK, webhooks, CLI | `how-to` + `reference` | API, CLI, Integrations |
| `operate` | Deploy, monitor, scale, troubleshoot | `how-to` | Guides (operations) |
| `understand` | Learn architecture, concepts, design tradeoffs | `explanation` | Core Concepts (not Getting Started) |
| `lookup` | Find exact field, flag, prop, or signature | `reference` | Reference groups / tabs |

---

## Journey-first ordering

When building `sidebar` group order within the main tab, prefer this spine:

1. **Getting Started** — `orient`, `first-success`, `author-content` (the path to a live, editable docs site)
2. **Guides** — `operate`, `integrate`, focused `how-to` tasks
3. **Configuration / Reference** — `customize`, `lookup`
4. **Core Concepts** — `understand` (defer until after practical guides exist)
5. **API / CLI / Components tabs** — `integrate`, `lookup` by surface area

### Rules

- **Getting Started must include** at least one `first-success` tutorial before any `understand` explanation pages elsewhere in the nav.
- **Do not lead with architecture.** Platform internals belong in Core Concepts or a nested Advanced group — not the first groups a new author sees.
- **`author-content` pages belong early** for documentation products (MDX/Markdown authoring, page structure, assets). Infer from capabilities about content authoring, editors, file formats, or preview.
- **Merge capabilities by user goal**, not only by `kind`. Multiple `docs-inventory.json` entries that serve the same goal (e.g. preview + local dev + file watcher → one “Local preview” how-to) belong on one page.
- **Split by user goal** when one capability serves different tasks (e.g. config schema vs navigation setup → separate how-to and reference pages).
- **Nest by user goal** within a group when onboarding and authoring (or operate vs integrate) would otherwise share a flat list — see [semantic-grouping.md](semantic-grouping.md).

---

## Inferring goals from capabilities

| `docs-inventory.json` signals | Likely `userGoal` |
| --- | --- |
| `kind: workflow`, `kind: cli` + init/setup commands | `first-success` |
| `kind: component`, content pipeline, markdown/mdx | `author-content` |
| `configuration`, theme, sidebar, branding | `customize` |
| `kind: api`, `kind: export`, webhooks | `integrate` or `lookup` |
| `kind: job`, deploy, scaling, monitoring | `operate` |
| Caching, architecture, internal pipelines | `understand` |
| Schema-only config keys, OpenAPI models | `lookup` |

When unsure, ask: *“What does the reader have in their hands when they finish this page?”*

---

## Audience pairing

Every page needs `audience` (required). Pair with `userGoal`:

| Audience | Usually cares about |
| --- | --- |
| `end-user` | `orient`, `first-success` |
| `contributor` | `author-content`, `first-success` |
| `integrator` | `integrate`, `customize`, `lookup` |
| `operator` | `operate`, `integrate` |

A page may list multiple audiences; `userGoal` stays singular.

---

## Validation hints

Flag in `outline.validation.issues` when:

| Rule | Severity | Condition |
| --- | --- | --- |
| `missing-first-success` | error | No `userGoal: first-success` tutorial in Getting Started |
| `architecture-before-action` | warning | Core Concepts group appears before Guides and no tutorial exists |
| `missing-author-content` | warning | Product has content-authoring capabilities but no `author-content` page |
| `missing-user-goal` | error | `outline.pages` entry lacks `userGoal` |
| `missing-audience` | error | `outline.pages` entry lacks `audience` |
