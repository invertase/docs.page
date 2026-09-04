---
name: improve-docs
description: Reviews one page in a docs.page project against technical writing standards and lists every evidence-backed issue on that page. Use when writing, editing, reviewing, or iterating on docs/*.mdx for a docs.page site.
---

# Improve a docs.page page

You are helping a docs.page publisher improve their docs. Their project has `docs.json` at the repo root and pages under `docs/`.

Work one page at a time:

1. Review the page.
2. List every issue you can support with a quote from the page.
3. Wait for the publisher to choose what to apply.

When they ask you to re-evaluate, including after they fix some items, re-evaluate. Do not re-evaluate unprompted.

Do not invent required pages, extra procedure steps, or information architecture. You are checking how this page is written, not whether the tutorial covers every product path.

## Standard

Use the summaries in [references/INDEX.md](references/INDEX.md). Prefer [docs.page authoring](https://use.docs.page/authoring/write) when it conflicts with leftover HTML-site or CMS advice.

1. Scan the page against [references/highlights.md](references/highlights.md).
2. When a finding needs a finer rule, read one file from the index. Do not load the whole `references/` directory.

Stay with the local summaries. Do not fetch an external style guide.

docs.page mechanics always win over leftover HTML-site and CMS advice:

- Frontmatter `title` and `description`
- Body headings start at `##` (no duplicate `#` title)
- Root-relative `/path` links (no domain, no `.mdx`)
- docs.page component names, not Mintlify or Docusaurus tags
- Language-tagged fences

These are guidelines. When fixing an issue would not make the page clearer, skip it.

## Read the page

Open the page you were asked to improve (`docs/**/*.mdx` or `.md`).

If you were given a published docs.page URL, send a `GET` request for `{url}.md` or `{url}.mdx` as raw text (`Accept: text/markdown`). That response is the GitHub source, including MDX tags. Do not convert the HTML page to markdown. Converters strip PascalCase MDX tags, and GitHub alerts can look like plain blockquotes.

If the text you have has no MDX tags but the live HTML shows numbered steps, callout panels, tabs, cards, or images, you stripped the source. Re-fetch as raw text. Do not flag missing components from converted HTML. Read [html-and-markdown.md](references/html-and-markdown.md) before you claim a component is absent or the wrong tag.

If the publisher asked for a site-wide pass, continue to other pages. Otherwise, stay on this page.

## Check the page

Check the page against the Highlights summary, using docs.page terms:

- **Person and voice.** Second person (`you`), not `we` or `let's`. Active voice: say who does the action.
- **Procedures.** A sequence the reader must follow. Numbering is already present if the MDX has `<Steps>` or `<Step>`, a Markdown numbered list, or the live page shows numbered stages. Do not ask to wrap those. When the source MDX has no `<Steps>` or `<Step>`, no Markdown numbered list, and the live page shows no numbered stages, flag unnumbered stages. Conditions before the instruction. Don't call a task `simple`, `easy`, or `quick`.
- **Components.** Built-in PascalCase tags and GitHub alerts (`> [!NOTE]`) already provide callouts, tabs, cards, and images. Do not flag them as missing, as raw HTML, or as another platform's tags (`<Note>`, `<Tab>`, `<CodeBlock>`). Component `title`, `label`, and `icon` props are not page headings. → [html-and-markdown.md](references/html-and-markdown.md)
- **Headings.** Frontmatter `title` is the page title (sentence case, bare infinitive for tasks). Body uses `##` and `###`. Do not repeat the title as `#` in the body.
- **Inline formatting.** Code, commands, and paths in code font. UI labels in **bold**.
- **Links.** Descriptive link text. In-site pages use root-relative `/path`. Product sites (`https://docs.page`, GitHub) stay absolute. `<Card href>` already counts as a link. Not `click here`, `this document`, or a raw URL the reader should follow.
- **Tone for a global audience.** No slang, idioms, or pre-announcements. No `please note`.

## Return the review

Quote the page. Name the style rule (and the reference file if you opened one). Do not report impressions without a quote and a named style rule. Return the review in the reply. If the publisher asked you to save a review file, write that file. Otherwise, return the review in the reply only.

```markdown
# <docs/... path>

## Findings
1. **[blocker|major|nit]** <style rule> — <what to change>
   Evidence: `<quote from the page>`
   Do this: <concrete edit>
```

- List every evidence-backed writing issue on this page. Worst first (`blocker`, then `major`, then `nit`). No cap. No Verdict. No Later section.
- When fixing an issue would not make the page clearer, skip it.
- Check how the page is written. Do not invent missing product steps, APIs, or git commands.
- If the publisher chose which findings to fix, apply only those. Otherwise, do not edit. When they ask, re-review. Do not re-review unprompted.
- If the publisher asked for a site-wide pass, continue to other pages. Otherwise, do not start another page.

---

The `references/` summaries are modified from the [Google developer documentation style guide](https://developers.google.com/style), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Google trademarks are not used as marks.
