# Headings and titles

The visible page title comes from YAML frontmatter `title`, not from a Markdown `#` in the body. Set `title` and `description` in frontmatter. Do **not** repeat the title as `# Page title` in the content — that duplicates the heading and confuses the **On this page** list.

Structure the body with `##` for major sections and `###` for subsections. The TOC includes Markdown `##` through `content.headerDepth` in `docs.json` (default `3`). It ignores headings inside code fences and ignores `<Heading>` components.

## Phrasing

Use **sentence case** on frontmatter `title` and on `##` / `###` headings: first word, first word after a colon, and proper nouns. No period at the end.

Do **not** apply this (or heading-level / TOC rules) to component `title` / `label` props or to fence `title="…"`. Those are UI labels on `<Step>`, `<Card>`, `<Accordion>`, `<TabItem>`, `<CodeGroup>`, and code blocks.

| Content | Use | Not |
|---|---|---|
| Task (how-to) | Bare infinitive: *Create an instance* | *Creating an instance* |
| Concept | Noun phrase: *Migration overview* | *Migrating your project* |
| Optional section | `Optional: Customize your alias` | *Customize your alias (optional)* |

Avoid *-ing* as the first word. Established labels like *Billing* are OK.

Don't skip levels (`##` then `####`). Don't leave headings empty. Don't put links in headings. Avoid code tokens in headings; if you must, add a noun (*the `docs.json` file*).

A bold **Before you begin** (or similar) above a prerequisite list is a docs.page pattern. Don't demand `## Before you begin` so it appears in **On this page**.

When introducing a group of subsections, say *the following sections*, not *this section*.

Prefer Markdown `##` over `<Heading>`. Use `<Heading type="h2" id="…">` only inside a component that does not parse Markdown. Those headings never appear in the TOC.
