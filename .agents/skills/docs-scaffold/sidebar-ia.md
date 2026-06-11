# Sidebar information architecture

Rules for `docs.json` `tabs` and `sidebar`. Read after `.docs/scaffold-plan.md` is approved.

**Tab strategy** comes from the plan (Phase 1), not from inventory kinds alone.

## Tab `href` — section roots only

docs.page matches tabs by **longest prefix**. Tab `href` must be the **section root**.

| Tab `href` | `/cli/check` matches? |
| --- | --- |
| `/cli` | Yes |
| `/cli/init` | No — wrong tab highlight |

1. Set `href` to section root (`/cli`, `/api`, `/components`)
2. Scaffold landing page at each root (`docs/cli/index.mdx` → `/cli`)
3. Root tab stays `href: "/"`

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

- **`icon`** required on every leaf — sync to `outline.pages.icon`
- **`href`** → `docs/{path}.mdx` (`/` → `docs/index.mdx`)
- Planning metadata in `outline.pages` only — no `_rationale` in JSON

## Group order (root tab)

Per spec journey spine:

1. Getting Started — `orient`, `first-success`, `author-content`
2. Guides — `integrate`, `operate` how-tos
3. Configuration — merged `customize` (Phase 3)
4. Comparisons — editorial (Phase 3, if in plan)
5. Core Concepts — `understand`, advanced-only (Phase 3)

## Nesting

When ≥2 categories with ≥3 pages in a group, nest sub-groups:

- Getting Started: nest author-content (Writing)
- Guides: nest by theme (Agents & AI, Publish, Search)
- CLI: Commands vs Programmatic
- Components: category sub-groups (always when ≥3 components)
- API: domain sub-groups (Documents, Agent & MCP, …)

≤7 top-level **groups** per tab. ≤7 leaves per group or sub-group.

## Components — always split

One page per `surface.ui` component. Nest under category sub-groups. Overview + traceability table at `/components`.

## Icons

Match purpose: `rocket` quickstart, `file-text` authoring, `terminal` CLI, `api` API, `component` components tab.

## Anti-patterns

- Tab `href` on child page (`/cli/init`)
- Section tab without landing page
- Architecture before Quickstart
- Flat list of 10+ API or config siblings
- Sidebar leaf without matching `outline.pages` entry

See [references/merge-rules.md](references/merge-rules.md) for merge discipline.
