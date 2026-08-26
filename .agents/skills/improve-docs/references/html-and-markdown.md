# MDX on docs.page

Pages are Markdown or MDX under `docs/`. Plain Markdown covers most writing. Built-in components need **no imports**. Use PascalCase tags; unknown names error in preview.

PascalCase tags are **not** raw HTML. Don't flag `<Steps>`, `<Info>`, `<Card>`, `<Image>`, or other built-ins as "don't use HTML." Don't add `target="_blank"`, custom CSS, or `visibility:hidden`. Documented props (`icon`, `className` on `<Image>`, `title` on a fence) are not custom CSS.

There is no `<CodeBlock>`, `<Note>`, `<Tab>`, `<Callout>`, `<Frame>`, or `<Check>`. Don't recommend those. Use the docs.page names below.

## Already valid — do not flag

HTML-to-markdown converters strip PascalCase tags. If the live HTML shows numbered steps, callout panels, tabs, cards, or images, re-fetch `{url}.md` as raw text. Do not report missing components from converted HTML.

| If the source already has… | Do not ask to… |
|---|---|
| `<Steps>` / `<Step>` | Wrap the sequence again, or treat it as unnumbered paragraphs |
| `<Info>` / `<Warning>` / `<Error>` / `<Success>` | Convert to a callout |
| `> [!NOTE]` / `[!TIP]` / `[!IMPORTANT]` / `[!WARNING]` / `[!CAUTION]` | Convert to `<Info>` (or siblings) — GitHub alerts render the same panels |
| `<CodeGroup>` around language-tagged fences | Treat those fences as unlabeled duplicates |
| `<Tabs>` / `<TabItem label value>` | Replace with `<Tab title>`, or treat panel bodies as an unnumbered procedure |
| `<Card>` / `<CardGroup>` with `href` | Add a markdown link next to the card. The `title` is the link text |
| `![alt](src)` | Upgrade to `<Image>` (enough for simple cases) |
| `<Image alt src>` | Convert to markdown `![]` |
| `<Property>` | Convert to a markdown table (or the reverse when a short table already works) |
| `<Accordion>` | Promote the `title` to a `##` heading, or call the hidden body a wall of text |
| ` ```mermaid ` | Replace the diagram with a table or screenshot |
| `<Icon>` or `icon="…"` on Card/Step | Add `alt`, or treat it as "describing a control by its icon" |
| `{{ variable }}` in the body | Rewrite as `ALL_CAPS` placeholders |
| `{owner}/{repo}` or other docs.page URL templates | Rewrite as `OWNER` / `REPO` |
| Bold **Before you begin** above a prereq list | Change it to `## Before you begin` |
| A procedure that omits `git init` or another product step | Add those commands as a style fix |

Component `title`, `label`, and fence `title="…"` are UI labels, not page headings. Don't apply sentence case, *-ing*, heading-level, or TOC rules to them. Sentence case applies to frontmatter `title` and to `##` / `###` only.

A callout's visible heading (**Information**, **Warning**, **Error**, **Success**) is fixed by the component. Don't flag those words as Title Case headings or as a generic Note.

## Reader need → tag

| Reader need | Use |
|---|---|
| Body, lists, links | Markdown |
| One snippet | Fenced code block (copy button is built in; there is no `<CodeBlock>`) |
| Language/platform variants | `<CodeGroup>` (fences only) or `<Tabs>` / `<TabItem>` (mixed prose) |
| Note / caution / blocker / success | `<Info>`, `<Warning>`, `<Error>`, `<Success>`, or the GitHub alert equivalent |
| Numbered setup | `<Steps>` / `<Step>` (already numbered if present or if the live page shows numbers) |
| Collapsible detail | `<Accordion>` / `<AccordionGroup>` |
| Section landing links | `<Card>` / `<CardGroup>` |
| API field rows | `<Property>` |
| Heading in the TOC | Markdown `##` (not `<Heading>`) |
| Inline icon | `<Icon>` |
| Screenshot / diagram image | Markdown `![]` or `<Image>` |
| Diagram from text | ` ```mermaid ` |

Don't demand `<CodeGroup>` or `<Tabs>` for a one-line platform caveat inside a callout (for example a PowerShell quoting note next to a single `npx` command).
