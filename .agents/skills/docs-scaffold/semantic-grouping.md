# Semantic sidebar nesting

Nest for **meaning**, not only when a group overflows seven leaves.

Apply to every sidebar group on every tab. [component-grouping.md](component-grouping.md) adds component-specific categories.

---

## When to nest (required)

Create nested `group` nodes when **either** condition is true:

| Trigger | Rule |
| --- | --- |
| **Category split** | Pages in the same top-level group map to **≥ 2 distinct categories** (see tables below) |
| **Overflow** | More than **7 leaf pages** in one group (hard cap) |

A sub-group with **one leaf** is discouraged — merge single pages into a sibling sub-group or the top level. Exception: CLI **Programmatic** with a single exports page may stay nested for clarity when **Commands** has multiple entries.

**Never** leave a flat list when categories clearly differ (e.g. quickstart + five authoring pages in one Getting Started list).

---

## How to detect categories

Use the strongest signal available, in order:

1. **`userGoal`** on planned pages (`first-success` vs `author-content` vs `operate`)
2. **`kind`** from `docs-inventory.json` (`cli` command vs `export`)
3. **URL prefix** (`/writing/*` vs `/guides/*`)
4. **Reader task** (configure vs deploy vs integrate)

---

## Category tables by section

### Getting Started

| Sub-group | `userGoal` | Typical pages |
| --- | --- | --- |
| **Onboarding** | `orient`, `first-success` | Overview, Quickstart, Install |
| **Writing & authoring** | `author-content` | MDX, preview, navigation, assets, redirects |
| **Customize** (optional) | `customize` | Theme quick tweaks — only if not in Configuration group |

If Getting Started has both onboarding and authoring pages → **nest**.

### Guides

| Sub-group | `userGoal` | Typical pages |
| --- | --- | --- |
| **Publish & host** | `operate` | Domains, publishing, branch previews |
| **Search & discovery** | `operate`, `customize` | Search, analytics, SEO |
| **Integrations** | `integrate` | Agent, MCP, webhooks, third-party |

If Guides has ≥ 2 of these themes → **nest**.

### Configuration

| Sub-group | Signal | Typical pages |
| --- | --- | --- |
| **Site config** | `lookup` | Main schema reference |
| **Appearance** | `customize` | Theme, branding, header |
| **Content** | `customize` | Display options, redirects |

Nest when ≥ 2 sub-groups each have ≥ 2 pages.

### CLI tab

| Sub-group | Signal | Typical pages |
| --- | --- | --- |
| **Commands** | `kind: cli` | init, check, agent create, agent delete |
| **Programmatic** | `kind: export` | CLI exports, embedding in Node/tools |

Always nest when both commands and programmatic API exist.

### API tab

| Sub-group | Signal | Typical pages |
| --- | --- | --- |
| **Documents** | bundle, raw, content | Document delivery endpoints |
| **Agent & MCP** | agent, mcp | AI and protocol surfaces |
| **Discovery** | search, schema, llms, sitemap | Indexes and metadata |
| **Platform** | health, og, ops | Infra and utilities |

Nest when ≥ 2 resource areas each have ≥ 2 endpoints.

### Components tab

Always categorize — see [component-grouping.md](component-grouping.md). Nest when **≥ 3 component pages** OR ≥ 2 categories.

---

## Sidebar shape (Getting Started example)

```json
{
  "group": "Getting Started",
  "tab": "root",
  "pages": [
    { "title": "Overview", "href": "/", "icon": "book" },
    { "title": "Quickstart", "href": "/quickstart", "icon": "rocket" },
    {
      "group": "Writing",
      "pages": [
        { "title": "MDX pages", "href": "/writing/mdx", "icon": "file-text" },
        { "title": "Local preview", "href": "/writing/local-preview", "icon": "eye" },
        { "title": "Navigation", "href": "/writing/navigation", "icon": "list" }
      ]
    }
  ]
}
```

Overview and Quickstart stay at the top level (onboarding path). Authoring pages nest under **Writing**.

---

## Procedure

After placing pages into top-level groups:

1. Tag each page with its **category** (from tables above or product-specific labels)
2. If ≥ 2 categories with ≥ 2 pages total → create sub-groups
3. Keep **overview / tutorial** at top level when they start the journey
4. Re-check **7-leaf cap** per group and sub-group
5. Re-check **3-level depth** cap (tab group → sub-group → page)

---

## Validation

| Rule | Severity | Check |
| --- | --- | --- |
| `missing-semantic-nest` | error | ≥ 2 categories in one group, ≥ 3 pages, no sub-groups |
| `max-siblings-per-group` | error | > 7 leaves in any group |
| `single-child-subgroup` | warning | Sub-group with only one leaf — merge up |
| `max-depth` | error | Nesting > 3 levels |

Report nested structure in the user summary (e.g. "Getting Started → Writing (4 pages)").
