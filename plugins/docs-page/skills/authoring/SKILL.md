---
name: authoring
description: Write or edit MDX pages for a docs.page site. Use when adding or editing .mdx files under docs/, when the user mentions docs.page components (callouts, Info/Warning/Error/Success, Steps, Cards, Tabs, Accordion, CodeGroup, Icon), page frontmatter, or asks why a docs.page page renders wrong or shows a red error box.
---

# Authoring docs.page MDX

Pages live at `docs/**/*.mdx`. The renderer owns everything; you only write MDX.

## The component set is fixed

Users **cannot** define or import components. `import`, `export` and `{expression}`
are never evaluated — they fall back to literal text on the page.

An unknown PascalCase tag renders a **loud red error box** on the published page
(`InvalidDocComponent`). It is not silently ignored. Only use these 21 names:

`Accordion` `AccordionGroup` `Card` `CardGroup` `Property` `Image` `Icon`
`Info` `Warning` `Error` `Success` `Tabs` `TabItem` `Tweet` `X` `YouTube`
`Vimeo` `Video` `Steps` `Step` `CodeGroup`

Full props table: `references/components.md`.

**Do NOT use `<Heading>`.** docs.page's own docs show it, but it has no entry in
the renderer's component map, so it renders the red error box. Use markdown `##`.

## Rules that stop real breakage

- **No fenced code block (or any block element) inside a list item.** It flattens
  the list — the numbering and the `<ol>` are lost. Use `<Steps>`/`<Step>` for
  numbered procedures that contain code.
- **No `# h1` in the body.** The title comes from frontmatter.
- **Escape a bare `<` in prose.** A `<` not followed by `/`, a letter or `{` is
  rewritten to `&lt;`.
- **`<Accordion>` with no `title` renders nothing** — silent content loss. So does
  `<AccordionGroup>` with no `<Accordion>` children. `Accordion`'s `icon` prop is
  accepted but never rendered.
- **Boolean props are strict.** Only a bare attribute (`<Image zoom />`) or the
  literal string `"true"` is true; anything else is false. Number props go through
  `Number()` and can become `NaN`.
- **`Icon name` is a Font Awesome Free slug without the `fa-` prefix**
  (`rocket`, not `fa-rocket`). A bad slug renders an empty icon with no error.
- **`CodeGroup` builds its tabs only from child fenced code blocks.** Label each
  fence with a `title`. Non-code children are ignored.
- **Raw HTML is sanitised against an allowlist.** Unknown tags and attributes are
  stripped silently.

## Free wins

- GitHub alert blockquotes are already mapped to callouts:
  `[!NOTE]`→`Info`, `[!TIP]`→`Success`, `[!IMPORTANT]`→`Warning`,
  `[!WARNING]`→`Warning`, `[!CAUTION]`→`Error`.
- ` ```mermaid ` fences render as diagrams.

## Frontmatter

The renderer reads exactly these keys:

`title` `description` `image` `noindex` `showPageTitle` `showPageImage`
`redirect` `previous` `previousTitle` `next` `nextTitle`

```yaml
---
title: Install
description: Get the SDK running in five minutes.
---
```

There is **no `icon` frontmatter key** — page icons come from the sidebar entry in
`docs.json`. There is **no ordering key** — page order lives in `docs.json`'s
`sidebar`. Unknown frontmatter keys are carried through and ignored.

## Link hygiene — do this by hand

`docs check` does **not** validate URL fragments/anchors, and does **not** read
`href` on any component (only `src` on `Image`/`img`). So before publishing:

```bash
grep -rn '](#' docs/
grep -rn 'href="#' docs/
grep -rn '<Card[^>]*href=' docs/
```

Open each target file and confirm the heading it points at actually exists.

## Finish

Run `npx @docs.page/cli check` before publishing — see the `check` skill for the
severity flags and what it does and does not cover.
