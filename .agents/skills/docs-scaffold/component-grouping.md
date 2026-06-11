# Component sidebar grouping

One page per component, organized into **semantic sub-groups**.

Read [semantic-grouping.md](semantic-grouping.md) first for universal nesting rules.

---

## Component-specific rules

1. **Split** — one page per `surface.ui` entry; never one catalog page
2. **Categorize** — assign every component to a category below
3. **Nest** — **always** when ≥ 3 component pages; use sub-groups per category when ≥ 2 categories exist
4. **Overview** — landing at `tab.href` stays first, top level

---

## Categories

| Category | Typical components |
| --- | --- |
| **Content** | Callout, Card, Accordion, Tabs |
| **Procedures** | Steps, CodeGroup |
| **Data display** | Property, Table, List |
| **Media** | Image, Video, YouTube, Vimeo, Embed |
| **Icons & chrome** | Icon, Badge, Header |
| **Social & external** | Tweet, Link preview |
| **Forms & input** | Input, Select, Form field wrappers |

Sort by author workflow: **Procedures** and **Content** before **Media** and **Social**.

---

## Sidebar shape

```json
{
  "group": "Components",
  "tab": "components",
  "pages": [
    { "title": "Overview", "href": "/components", "icon": "book" },
    {
      "group": "Procedures",
      "pages": [
        { "title": "Steps", "href": "/components/steps", "icon": "list-ol" },
        { "title": "CodeGroup", "href": "/components/code-group", "icon": "code" }
      ]
    },
    {
      "group": "Media",
      "pages": [
        { "title": "Image", "href": "/components/image", "icon": "image" },
        { "title": "Video", "href": "/components/video", "icon": "video" }
      ]
    }
  ]
}
```

---

## Validation

- `component-flat-list` — **error** when ≥ 3 component leaves share one group without sub-groups
- `max-siblings-per-group` — error when any sub-group has > 7 leaves
