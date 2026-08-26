# Computer interfaces

Code in ordinary sentences: [lists-and-formatting.md](lists-and-formatting.md).

## Code samples

Introduce the sample with a complete sentence (colon if the fence follows immediately). Use a **language-tagged fence** (`bash`, `json`, `tsx`, `mermaid`). There is no `<CodeBlock>` component. Every fence gets a copy button and a language label — you cannot turn copy off, so keep samples complete enough to paste. Don't ask authors to add a copy hint or line numbers.

Optional `title="…"` on the opening fence line is a header label, not a heading. Diff / highlight / focus: Shiki comments such as `// [!code ++]` (use that language's comment syntax). Those are not GitHub alerts and not a style defect.

Several **equivalent** snippets (languages or platforms): `<CodeGroup>` (every child is a fence) or `<Tabs>` / `<TabItem>` (mixed prose). Don't treat fences inside an existing `<CodeGroup>` as unlabeled duplicates. Don't demand a code group for a one-line platform caveat in a callout.

Wrap long lines so they stay readable. If you omit lines, use a comment in that language, not a prose `...` inside the fence.

## Command-line syntax

Show the command for the common case. Explain placeholders after the command. Don't say *run the following command* — say what it does. Use `\` continuations only where a real shell needs them.

## Placeholders

Descriptive `ALL_CAPS_WITH_UNDERSCORES` (`PROJECT_ID`) in command samples, not `xxx` or `foo` unless HTTP `2xx` style. Say what to replace.

Don't rewrite docs.page URL templates (`https://docs.page/{owner}/{repo}`) or MDX `{{ variable }}` as `ALL_CAPS`. Those are product syntax. `{{ variable }}` works in MDX **body** only, with values from `docs.json`. Don't put substitutions in frontmatter.

## UI

Bold the label. Where, then action. Menus: **File > New**. Don't describe by icon shape or screen position. Use *click*, *enter*, *select* to match the control; stay consistent on the page.

## API and config fields

On a reference page, document fields with `<Property>` or a short markdown table — both are valid. Don't convert one into the other when it already fits. Don't use a Javadoc comment block. In running text, describe what a method **does** (*Creates a task*) on reference pages; use imperatives on how-tos.
