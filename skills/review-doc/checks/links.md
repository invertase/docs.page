# links

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### link-text

- **Scan:** every markdown and MDX link (`[]()`, `href`)
- **Finding if:** text is `click here`, `this document`, `this article`, or a raw URL; or the text does not make sense out of context
- **Skip if:** `<Card href>` — the `title` is already the link text; do not add a markdown link next to it

### duplicate-destination

- **Scan:** destinations on the page
- **Finding if:** the same URL or path is linked more than once
- **Skip if:** a long page with separate entry points (procedure vs troubleshooting); a navigational block at the end of the page (*Next steps*, *Related*, a `<CardGroup>`) repeating a destination the body already linked — that block is navigation, not a second inline reference

### in-site-url

- **Scan:** every `https://` link
- **Finding if:** an in-site docs page is a full URL (should be root-relative, no `.mdx` / `.md`)
- **Skip if:** the first marketing link to `https://docs.page`; other product marketing or GitHub hosts

### hyphenated-compound

- **Scan:** links inside hyphenated words
- **Finding if:** the link is spliced into a hyphenated compound
- **Skip if:** none

### punctuation-outside

- **Scan:** punctuation next to `[]()` link text
- **Finding if:** a period, comma, or colon is inside the link; or a linked title is wrapped in quotation marks
- **Skip if:** the punctuation is part of the UI or page title you are quoting

### see-cross-ref

- **Scan:** sentences whose only job is a cross-reference
- **Finding if:** the sentence is not *For more information, see…* / *For more information about…, see…*; or it uses *on* instead of *about*
- **Skip if:** the link is inline in a sentence that already has another purpose
