# text-formatting

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### bold

- **Scan:** every `**…**` span
- **Finding if:** bold is not a UI label or run-in list stem
- **Skip if:** MDX `title=` / `icon=` / `label=` values

### italics

- **Scan:** `_italic_` / `*italic*` (single)
- **Finding if:** italics are used for UI, code, or fake emphasis in every paragraph — not for a new term on first definition, a word-as-word, a book title, or a math variable
- **Skip if:** none

### ampersand

- **Scan:** `&` and `&amp;` in headings and body copy
- **Finding if:** `&` stands for *and*
- **Skip if:** code; a UI label that literally contains `&`

### all-caps-prose

- **Scan:** words in all caps in prose
- **Finding if:** all caps is shouting, not a placeholder (`PROJECT_ID`)
- **Skip if:** official names; code font
