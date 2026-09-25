# docs.page component reference

21 legal tag names, 19 distinct components (`X` aliases `Tweet`). Anything else
PascalCase renders a red `InvalidDocComponent` error box on the page.

| Component | Props | Required | Notes |
|---|---|---|---|
| `Accordion` | `title: string`, `defaultOpen: boolean`, `icon: string` | `title` | No `title` ⇒ renders **nothing**. `icon` is accepted but never rendered. |
| `AccordionGroup` | `type: "single" \| "multiple"` (default `"multiple"`) | — | Renders nothing if it has no `Accordion` children. |
| `Card` | `title: string`, `icon: string`, `href: string` | — | `href` is **never** link-checked by `docs check`. |
| `CardGroup` | `cols: number` (default `2`) | — | Grid map only covers 1–4. |
| `Property` | `name: string`, `type: string`, `required: boolean`, `optional: boolean` | — | |
| `Image` | `src`, `alt`, `className`, `caption` (strings), `width`, `height` (numbers), `zoom` (boolean), `theme: "light" \| "dark"` | — | `src` is the only JSX attribute `docs check` validates. |
| `Icon` | `name: string`, `size: number` (px), `style: CSSProperties` | `name` | FA Free slug **without** `fa-`. Brand slugs resolve to `fa-brands`, everything else `fa-solid`. A bad slug renders an empty icon, no error. |
| `Info` | children only | — | Callout. |
| `Warning` | children only | — | Callout. |
| `Error` | children only | — | Callout. |
| `Success` | children only | — | Callout. |
| `Tabs` | `groupId: string`, `defaultValue: string`, `values: {label,value}[]` | — | |
| `TabItem` | `label: string`, `value: string` | `value` | |
| `Tweet` | `id: string`, `cards: boolean`, `conversation: boolean` | `id` | |
| `X` | alias of `Tweet`, identical props | `id` | |
| `YouTube` | `id: string` | `id` in practice | |
| `Vimeo` | `id: string`, `video: string` | — | |
| `Video` | strings: `src`, `type`, `className`, `title`, `poster`; booleans: `controls`, `autoPlay`, `muted`, `loop`, `playsInline`; numbers: `width`, `height`; `preload: "auto" \| "metadata" \| "none"`; `crossOrigin: "" \| "anonymous" \| "use-credentials"` | — | |
| `Steps` | children only | — | Use for numbered procedures. |
| `Step` | `title: string`, `icon: string` | — | |
| `CodeGroup` | `title: string`, `defaultLanguage: string`, `synchronize: boolean` | — | Tabs are **derived** from child fenced code blocks; `blocks` is not authored. Non-code children are ignored. Tab label = fence `title`, else fence meta without `=`, else the language. |

## Not a component — `Heading`

`<Heading type="h2" id="...">` appears in docs.page's own documentation but has
**no entry in the renderer's component map**, so it falls through to the red error
box. Use markdown `##` / `###` headings instead.

## Implicitly available, no tag needed

- Fenced code blocks render as a code fence with copy/highlighting.
- ` ```mermaid ` fences render as diagrams.
- Markdown `#`-style headings render through the internal heading component
  (anchors, table of contents).
- GitHub alert blockquotes are rewritten into callouts:

  | Alert | Becomes |
  |---|---|
  | `> [!NOTE]` | `Info` |
  | `> [!TIP]` | `Success` |
  | `> [!IMPORTANT]` | `Warning` |
  | `> [!WARNING]` | `Warning` |
  | `> [!CAUTION]` | `Error` |

## Prop coercion

- **Boolean**: a bare attribute or the literal string `"true"` ⇒ `true`.
  Everything else ⇒ `false`.
- **Number**: run through `Number()`; a non-numeric value becomes `NaN`.

## What is silently swallowed (no error box)

- Unknown or unsafe **lowercase** HTML tags and attributes — stripped by the
  sanitiser allowlist.
- `import` / `export` / `{js expressions}` — printed as literal markdown text.
- `<Accordion>` with no `title`, and `<AccordionGroup>` with no children.
