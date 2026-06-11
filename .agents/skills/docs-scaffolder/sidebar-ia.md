# Sidebar information architecture

Rules for `docs.json` `tabs` and `sidebar` so users reach answers in under 30 seconds.

---

## docs.page sidebar shape

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
- Planning metadata lives in `outline.pages`, matched by `href` — not on sidebar items

---

## Heuristics

### Rule of 7±2

≤ 7 top-level **groups** per tab. Merge or nest when exceeded.

### Three-click max

Depth: group → optional nested group → page. No fourth level.

### Progressive disclosure

| Audience | Pattern |
| --- | --- |
| Beginners | Shallow Getting Started; advanced in nested groups |
| Integrators | Dedicated Configuration / API groups |
| Operators | CLI / Publishing separated from concepts |

Exhaustive option lists belong on `reference` pages, not Getting Started nav.

---

## Placement procedure

1. **Scan** existing `docs.json` `sidebar` and `outline.pages`
2. **Match persona** to parent group:

   | Signals | Prefer group |
   | --- | --- |
   | `end-user`, first-run | Getting Started |
   | `kind: component` | Components (`tab: components`) |
   | `kind: cli` | CLI (`tab: cli`) |
   | `kind: api`, config | Configuration, API Reference |
   | `kind: integration` | Guides, Integrations |
   | task-oriented `feature` | Guides |
   | conceptual `feature` | Core Concepts |

3. **Propose** single parent + `href` slug; prefer existing groups
4. **Validate** depth, group count, unique hrefs
5. **Sync** — add matching `outline.pages` entry for every sidebar leaf

---

## Slug conventions

| href | file |
| --- | --- |
| `/getting-started` | `docs/getting-started.mdx` |
| `/components/steps` | `docs/components/steps.mdx` |
| `/cli/init` | `docs/cli/init.mdx` |

- kebab-case segments
- Mirror URL in filesystem
- Prefer anchors over new pages for small subtopics

---

## docType → placement

| docType | Typical tab | Typical group |
| --- | --- | --- |
| tutorial | root | Getting Started |
| how-to | root, cli | Guides, CLI |
| reference | root, components, cli | Configuration, Components, CLI |
| explanation | root | Core concepts, Architecture |

---

## Anti-patterns

- Reference dump in Getting Started top-level
- Duplicate nav titles without distinction
- Sidebar leaf without matching `outline.pages` entry
- Micro-pages — merge into one `reference` with sections
