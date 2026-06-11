# Sidebar information architecture

Rules for `docs.json` `tabs` and `sidebar` so users reach answers in under 30 seconds.

Read [user-journeys.md](user-journeys.md) **first** for journey-first group ordering. Apply [semantic-grouping.md](semantic-grouping.md) when building every group — nest by category, not only by page count.

**Tab strategy lives here**, not in `docs-spec.md`. The spec sets persona, journeys, and omit/defer policy; tabs follow inventory signals (`kind: api`, `kind: cli`, `kind: component`, …) and the rules below.

---

## Sidebar shape

```json
{
  "tabs": [
    { "id": "root", "title": "Documentation", "href": "/" }
  ],
  "sidebar": [
    {
      "group": "Getting Started",
      "tab": "root",
      "pages": [
        { "title": "Overview", "href": "/", "icon": "book" }
      ]
    }
  ]
}
```

- **`href`** → `docs/{path}.mdx` (strip leading `/`; `/` → `index.mdx`)
- **`tab`** on a group scopes visibility to that tab `id`
- **`icon`** required on every sidebar leaf (see Icons below)
- Planning metadata lives in `outline.pages`, synced by `href`

---

## Tab `href` — section roots only

docs.page picks the active tab by **longest prefix match** on the current page path. A tab matches when the path equals `tab.href` or starts with `tab.href/`.

| Tab `href` | Page `/cli/check` matches? |
| --- | --- |
| `/cli` | Yes — `cli/check` starts with `cli/` |
| `/cli/init` | No — `cli/check` ≠ `cli/init` and does not start with `cli/init/` |

If **no** tab matches, the site falls back to the **first tab** (usually Documentation). Sibling pages under the same section then highlight the wrong tab.

### Rules

1. Set each non-root tab `href` to the **section root**, not the first page in that section:

   ```json
   { "id": "cli", "title": "CLI", "href": "/cli" }
   { "id": "api", "title": "API", "href": "/api" }
   { "id": "components", "title": "Components", "href": "/components" }
   ```

   **Wrong:** `"href": "/cli/init"`, `"href": "/api/jobs"`, `"href": "/components/steps"`

2. **Scaffold a landing page** at each section root (`docs/cli/index.mdx` → `/cli`, `docs/api/index.mdx` → `/api`). The tab bar links to `tab.href` when clicked — without a page, that URL 404s.

3. Put the landing page first in the section's sidebar group (Overview / Introduction).

4. Root tab stays `"href": "/"`.

### Prefix overlap

Avoid two tab `href` values where one is a prefix of another unless intentional (e.g. `/` vs `/api` is fine). Prefer distinct top-level segments: `/cli`, `/api`, `/components`, `/ui`.

---

## Icons

Every sidebar leaf must have an `icon`. Mirror it on the matching `outline.pages` entry.

| Content type | Suggested icons |
| --- | --- |
| Overview / landing | `book` |
| Quickstart / tutorial | `rocket` |
| How-to guide | `file-text`, `wrench` |
| Configuration | `settings`, `gear` |
| API reference | `code`, `api` |
| CLI command | `terminal` |
| UI component | match component purpose (`list`, `image`, `tabs`, …) |
| Deploy / publish | `globe` |
| Search | `search` |
| Architecture / concepts | `layers` |

Use icons consistent with sibling pages. Pick semantically close names supported by the documentation host (e.g. `rocket`, `settings`, `terminal`). When the host publishes an icon list, prefer names from that list.

---

## Heuristics

### Rule of 7±2

≤ 7 top-level **groups** per tab. Merge or nest when exceeded.

### Semantic nesting

When pages in a group fall into **≥ 2 categories** (by `userGoal`, task, or domain), use nested sub-groups — even with fewer than 7 leaves. See [semantic-grouping.md](semantic-grouping.md).

### Max siblings per group

≤ 7 **leaf pages** per group or sub-group. If more, nest further. Components: [component-grouping.md](component-grouping.md).

### Three-click max

Depth: group → optional nested group → page. No fourth level.

### Progressive disclosure

| Audience | Pattern |
| --- | --- |
| Beginners | Shallow Getting Started; advanced in nested groups |
| Integrators | Dedicated Configuration / API groups |
| Operators | CLI / deployment groups separated from concepts |

Exhaustive option lists belong on `reference` pages, not Getting Started nav.

---

## Placement procedure

1. **Plan journeys** — read [user-journeys.md](user-journeys.md); order groups by user goals
2. **Scan** existing `docs.json` `sidebar` and `outline.pages`
3. **Match persona** to parent group:

   | Signals | Prefer group |
   | --- | --- |
   | `userGoal: first-success`, `author-content` | Getting Started |
   | `userGoal: understand` | Core Concepts (after Getting Started) |
   | `kind: component` | Components tab — **one page per component** (see below) |
   | `kind: cli` | CLI tab |
   | `kind: api`, config | API / Configuration |
   | `kind: integration` | Guides, Integrations |
   | `userGoal: operate` | Guides |
   | `userGoal: lookup` | Reference groups |

4. **Propose** parent group + `href` slug + `icon`; prefer existing groups
5. **Nest** — apply [semantic-grouping.md](semantic-grouping.md); tag categories; add sub-groups
6. **Validate** depth, group count, semantic nests, unique hrefs, icons
7. **Sync** — `outline.pages` entry for every sidebar leaf (include `icon`)

---

## Component pages — always split

**Do not** merge a component catalog into one page.

| Condition | Action |
| --- | --- |
| `kind: component` with `surface.ui` array | One page per named entry |
| `kind: component` with multiple distinct `sources` (one file per widget) | One page per widget |
| Single umbrella capability listing many components | Split using `surface.ui`; parent capability id on each page's `capabilityIds` |

Each component page:

- `href`: `/components/{kebab-case-name}` (or `/ui/{name}` if the product uses a UI tab)
- `docType`: `reference`
- `userGoal`: `lookup` or `author-content` (when authors compose with the component)
- `title`: component name as authors would search for it

Nest under a **Components** group. **Always** use category sub-groups when ≥ 3 components — see [component-grouping.md](component-grouping.md).

Section overview at `tab.href` renders a **traceability table** on the stub page (not in `docs.json`).

---

## Merge vs split (non-components)

| Merge into one page | Split into separate pages |
| --- | --- |
| Config keys in the same schema section | Different user goals (`customize` vs `lookup`) |
| API endpoints in the same resource | Tutorial vs reference for the same feature |
| Steps of one workflow | Distinct UI components (always split) |
| Related CLI flags for one command | Separate CLI subcommands |

---

## Slug conventions

| href | file |
| --- | --- |
| `/quickstart` | `docs/quickstart.mdx` |
| `/components/steps` | `docs/components/steps.mdx` |
| `/cli/init` | `docs/cli/init.mdx` |

- kebab-case segments
- Mirror URL in filesystem
- Prefer anchors over new pages for small subtopics **within** a page — not for separate components

---

## docType → placement

| docType | Typical tab | Typical group |
| --- | --- | --- |
| tutorial | root | Getting Started |
| how-to | root | Getting Started, Guides |
| reference | root, components, cli, api | Configuration, Components, CLI, API |
| explanation | root | Core Concepts (not Getting Started) |

---

## Anti-patterns

- Tab `href` set to a child page (`/cli/init`) instead of section root (`/cli`)
- Section tab without a landing page at `tab.href`
- Reference dump in Getting Started top-level
- Architecture pages before first-success tutorial
- Duplicate nav titles without distinction
- Sidebar leaf without `icon` or matching `outline.pages` entry
- Single mega-page for all UI components
- Flat component list (≥ 3 components) without category sub-groups
- Flat Getting Started mixing onboarding and authoring without a **Writing** sub-group
- Flat CLI mixing commands and programmatic API without sub-groups
- Merging API/CLI surfaces that authors look up independently
