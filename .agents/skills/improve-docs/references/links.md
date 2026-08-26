# Cross-references and links

Each link is a decision and a chance to leave the page. Link only when it helps. Prefer a sentence of context on the page over a hop for a definition or two steps.

Don't duplicate the same destination on one page unless the page is long or there are separate entry points (procedure vs troubleshooting).

## Link text

Use the page title or a short descriptive phrase. Link text must make sense out of context.

Not recommended: *click here*, *this document*, *this article*, a raw URL.

Recommended: For more information, see [Preview](/authoring/preview).

Put punctuation outside the link. Don't wrap linked titles in quotation marks.

When a dedicated sentence is a cross-reference, use *For more information, see…* or *For more information about…, see…*. Use *about*, not *on*. Use *see* for links.

## Internal links (docs.page)

Root-relative paths: no domain, no `.mdx` / `.md` extension.

```mdx
See [Preview](/authoring/preview) before you open a pull request.
```

Product marketing sites (`https://docs.page`, `https://github.com`, …) are **external**. Don't rewrite those to `/`. Only in-site pages use root-relative `/path`.

A `<Card title="…" href="/path">` is already a link. The `title` is the link text. Don't add a markdown link next to it.

`docs check` catches broken internal links. After a rename, add a [redirect](https://use.docs.page/authoring/redirects).

Don't advise `target="_blank"` or external-link icons — authors don't control tab behavior or link CSS.

## Heading anchors

Markdown headings get slugified `id`s automatically (lowercase, hyphens, numeric suffix on duplicates). Hover anchors and TOC entries come from those slugs. Changing heading text changes the slug and can break inbound `#` links.

Use Markdown `##` when the section should appear in **On this page**. `<Heading>` can take a manual `id` for a hover link but is **never** added to the TOC.
