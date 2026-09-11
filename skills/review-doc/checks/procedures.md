# procedures

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### unnumbered-sequence

- **Scan:** numbered lists and `<Steps>` / `<Step>`
- **Finding if:** three or more actions the reader must follow in order are still unnumbered in the source
- **Skip if:** existing `<Steps>` (including `icon` on `<Step>` — do not wrap again); a Markdown numbered list; *Quickstart* as a page or card title; `<Tabs>` / `<TabItem>` panel bodies; a one-line platform caveat in a callout (do not demand `<CodeGroup>` / `<Tabs>`); omitted product commands (`git init`)

### lettered-substeps

- **Scan:** lettered or Roman-numeral lists inside a procedure (`a.` `b.` `(i)`)
- **Finding if:** sub-steps use letters or Roman numerals
- **Skip if:** none — that is not a docs.page pattern

### procedure-intro

- **Scan:** the sentence immediately before a numbered list or `<Steps>`
- **Finding if:** the intro is a partial sentence the steps complete (*To customize the buttons:*)
- **Skip if:** a complete sentence, or a short stem that is already a full instruction (*Customize the buttons:*)

### one-action

- **Scan:** each `<Step>` and each numbered-list item
- **Finding if:** the step contains two independent reader actions; or the first sentence has no imperative verb
- **Skip if:** tiny sequential menu clicks written **File > New**

### one-step-list

- **Scan:** numbered lists and `<Steps>` with exactly one item
- **Finding if:** a single action is numbered
- **Skip if:** the single item is a bullet, or a one-sentence instruction not in a list

### optional-label

- **Scan:** `(Optional)` and `Optional:` in steps
- **Finding if:** optional steps use `(Optional)` instead of `Optional:`
- **Skip if:** `Optional:` already

### parallel-verbs

- **Scan:** imperative verbs across steps in the same procedure
- **Finding if:** verb forms are not parallel (*Install* then *Configuring*)
- **Skip if:** a one-step procedure

### step-order

- **Scan:** each step that names a tool or a result
- **Finding if:** the action comes before where (tool or page); or a fenced command comes before the action that introduces it
- **Skip if:** the step is a single imperative with no fence
