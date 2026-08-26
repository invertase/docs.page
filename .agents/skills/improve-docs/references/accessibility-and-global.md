# Accessibility and global audience

Write so the page still works without images, without color, with magnification, and with a screen reader. You do not control docs.page chrome (link underlines, skip links, theme contrast) — flag authoring issues only.

## Language

- Break walls of text: `##` headings, short paragraphs (important point first), lists.
- Aim for under 26 words per sentence. Avoid double negatives.
- Don't use *above*, *below*, *left*, *right* for position. Use *preceding*, *following*, or the element's name.
- Don't use *click here*. Link text must work out of context. → [links.md](links.md)
- Don't use `&` for *and* in headings or body copy (OK in code and in UI labels that literally contain `&`).
- Avoid camel case and all-caps in prose.

## Images and media

- Meaningful `alt` on `![alt](src)` and `<Image alt="…">`. docs.page uses empty `alt` if you omit it.
- Don't demand `alt` on `<Icon>` or on `icon="…"` (Font Awesome slugs on cards and steps).
- Don't put new information only in an image.
- Don't screenshot text, code, or terminal output — use a fence. A ` ```mermaid ` fence is a valid diagram, not a missing screenshot.
- SVG for logos; PNG or WebP for screenshots. Captions: `<Image caption="…">`.

## Tables

Introduce the table in the preceding sentence. Prefer a list or `<Property>` if a table isn't needed. Markdown tables can't merge cells.

## Global audience

US English. Short, primary-sense words (*use* not *utilize*). Avoid idioms, humor, holidays, sports, and seasons as dates.

Be consistent: same term, same capitalization. Spell out abbreviations on first use. Repeat helper words (*that*, *then*, *of*) when dropping them creates ambiguity.
