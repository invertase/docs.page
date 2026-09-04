# Procedures

A procedure is a sequence the reader must follow in order.

The procedure is already numbered — **do not** flag it — if any of these is true:

- The MDX contains `<Steps>` / `<Step>`
- The MDX contains a Markdown numbered list (`1.` `2.` `3.`)
- The live page already shows numbered stages in the browser

HTML-to-markdown converters drop `<Steps>` and leave unnumbered paragraphs. That is not a finding. Re-fetch `{url}.md` as raw text before you claim steps are unnumbered.

For **three or more stages that are still unnumbered in the source MDX**, wrap them in `<Steps>` / `<Step>`. For a short sequence, a Markdown numbered list is fine. Don't use lettered or Roman-numeral sub-steps — that is not a docs.page pattern.

Parallel options belong in `<Tabs>` / `<TabItem>` or `<CodeGroup>`, not in a procedure. Don't treat tab panel bodies as an unnumbered procedure. Don't demand `<CodeGroup>` for a one-line platform caveat inside a callout (for example a PowerShell quoting note). `icon` on `<Step>` replaces the number with an icon in the UI; the sequence is still a procedure — do not flag it as unnumbered.

## Introduce the procedure

Give context the heading does not already give. Don't complete a partial sentence with the steps.

Recommended: To customize the buttons, follow these steps:  
Also recommended: Customize the buttons:  
Not recommended: To customize the buttons:

Don't introduce a command with *run the following command*. Say what the command does, then show a language-tagged fence.

## Shape

- One action per step.
- Combine only tiny sequential menu clicks with `>` (**File > New**).
- One-step procedures: one sentence in a **bullet**, not a numbered list of one.
- Optional steps start with `Optional:`, not `(Optional)`.
- Repeat procedures by linking; don't copy them.
- If several methods exist, document the shortest one that a keyboard user can complete.

`<Step title="…">` titles should be short and action-oriented (*Install dependencies*). `title` is optional when the body is self-explanatory.

## Order inside a step

1. Where (tool or page), then the action.
2. Goal before action when it helps: To start a new page, click **Add**.
3. Action, then fenced command, then placeholder explanations, then result.
4. Condition **before** the instruction (see [sentence-structure.md](sentence-structure.md)).

Don't use directional language (*above*, *below*, *right-hand side*). Don't use *please*. Don't list keyboard shortcuts as the primary method.

First sentence of a step must include an imperative verb. Use parallel verb forms across steps.

Don't invent missing commands or prerequisites (*git init*, extra APIs, a second install path) unless the writing itself is the defect. Completeness of a product path is not a style finding.
