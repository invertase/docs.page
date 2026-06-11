# Component sidebar grouping

One page per component — but never a flat list of more than **7 sibling leaves** in one group.

Read after [sidebar-ia.md](sidebar-ia.md) component split rules.

---

## Limits

| Level | Max siblings | Action when exceeded |
| --- | --- | --- |
| Top-level sidebar **groups** per tab | 7 | Merge groups or nest |
| **Leaves** in one group (pages + nested group headers count as structure) | 7 | Nest into sub-groups |
| Nesting depth | 3 | group → sub-group → page |

Count **only leaf pages** when checking a group. A nested `{ "group": "Media", "pages": [...] }` counts as one structural child; leaves inside it count toward that sub-group's limit.

---

## Categorization procedure

After creating one page per `surface.ui` entry:

1. List all component pages for the tab
2. Assign each to a **category** (pick closest; 3–7 categories typical):

   | Category | Typical components |
   | --- | --- |
   | **Content** | Callout, Card, Accordion, Tabs |
   | **Procedures** | Steps, CodeGroup |
   | **Data display** | Property, Table, List |
   | **Media** | Image, Video, YouTube, Vimeo, Embed |
   | **Icons & chrome** | Icon, Badge, Header |
   | **Social & external** | Tweet, Link preview |
   | **Forms & input** | Input, Select, Form field wrappers |

3. If total component leaves ≤ 7 (excluding section overview), one group is fine
4. If > 7, create nested `group` nodes per category
5. Sort categories by author workflow: **Procedures** and **Content** before **Media** and **Social**

---

## Sidebar shape (nested)

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

Overview stays first at the section root (`tab.href`).

---

## Validation

- `max-siblings-per-group` — error when any group has > 7 leaf pages without nesting
- `component-flat-list` — warning when > 7 component leaves sit in one group without sub-groups
