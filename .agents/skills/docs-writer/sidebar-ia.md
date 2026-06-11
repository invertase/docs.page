# Sidebar information architecture

Rules for placing and organizing pages in `docs.json` so users reach answers in under 30 seconds.

---

## docs.json structure (docs.page)

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
        { "title": "Overview", "href": "/", "icon": "book" },
        {
          "group": "Advanced",
          "pages": [
            { "title": "Nested topic", "href": "/guides/nested" }
          ]
        }
      ]
    }
  ]
}
```

- **`href`** maps to `docs/{path}.mdx` (leading `/` stripped; `/` → `index.mdx`)
- **`tab`** on a group filters visibility to that tab's `id`
- **Nested `group`** inside `pages` creates expandable sub-sections

---

## Heuristics

### Rule of 7±2

Count top-level **groups** per tab (not individual pages). If a tab has more than 7 groups, merge related groups or move pages into nested sub-groups.

### Three-click max

Depth = group → (optional nested group) → page. Never add a fourth nesting level. If depth would exceed 3, flatten or split into a new tab.

### Progressive disclosure

| Audience | Sidebar pattern |
| --- | --- |
| Beginners | Top-level links; advanced topics in nested group collapsed by default |
| Integrators | Config/API in dedicated group; link to Reference from How-To body |
| Operators | CLI/deployment groups separate from conceptual docs |

Put exhaustive option lists on Reference pages, not in Getting Started sidebars.

---

## Global IA Sync procedure

### 1. Scan existing tree

Read `docs.json` → `sidebar`. For the active `tab`, list:

- Group names and page counts
- Existing `href` values (avoid duplicates)
- Current max nesting depth

### 2. Persona → parent group matching

| Capability signals | Prefer group named like |
| --- | --- |
| `audience: end-user`, first-run | Getting Started |
| `kind: component` | Components (often `tab: components`) |
| `kind: cli` | CLI (`tab: cli`) |
| `kind: api`, `configuration` | Configuration, API Reference |
| `kind: integration` | Guides, Integrations |
| `kind: feature` + task | Guides |
| `kind: feature` + concept | Core Concepts (Explanation) |

If no group fits and the tab has &lt; 7 groups, add a new group. If at capacity, nest under the closest semantic parent.

### 3. Slug and file path

| href | file path |
| --- | --- |
| `/getting-started` | `docs/getting-started.mdx` |
| `/components/steps` | `docs/components/steps.mdx` |
| `/cli/init` | `docs/cli/init.mdx` |

- kebab-case segments
- Mirror URL structure in filesystem
- One page per `href`; use anchors (`#section`) for subtopics before creating new pages

### 4. Sidebar entry patch

**New page in existing group** — append to `pages`:

```json
{
  "title": "Local Previews",
  "href": "/local-previewing",
  "icon": "eye"
}
```

**New nested section:**

```json
{
  "group": "Advanced",
  "pages": [
    { "title": "Vanity Domains", "href": "/vanity-domains" }
  ]
}
```

**Icon hints:** `book`, `rocket`, `gear`, `map`, `pencil`, `code`, `terminal`, `globe` — match sibling pages in the group.

### 5. Validation checklist

- [ ] `href` is unique across all tabs (or intentional duplicate with different tab scope)
- [ ] Nesting depth ≤ 3
- [ ] Parent group has ≤ 7 top-level sibling groups on that tab
- [ ] `tab` id exists in `tabs` array
- [ ] Corresponding `.mdx` file exists or will be created in same commit
- [ ] Page `title` in sidebar matches frontmatter `title` (or differs only for brevity in nav)

---

## Placement decision table

| Doc type | Typical tab | Typical group | Nest when |
| --- | --- | --- | --- |
| Tutorial | root | Getting Started | Rarely |
| How-To | root or cli | Guides, CLI | Advanced variants |
| Reference | root, components, cli | Configuration, Components, CLI | Large schemas |
| Explanation | root | Core concepts, Architecture | Sub-concepts |

---

## Anti-patterns

- **Reference dump in Getting Started** — move to Configuration or nested Advanced
- **Duplicate titles** in sidebar ("Configuration" page inside "Configuration" group without distinction)
- **Orphan pages** — every new `.mdx` must have a sidebar entry unless explicitly standalone (redirect-only)
- **Micro-pages** — merge tiny Reference sections into one page with `<Accordion>` sections
