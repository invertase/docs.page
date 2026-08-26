# Lists and formatting

## Lists

- **Numbered:** short sequences, or three or more tutorial stages in `<Steps>`. Existing `<Steps>` or a live numbered UI already counts — [procedures.md](procedures.md).
- **Bulleted:** unordered set. Don't use a list of one item.
- **Description / run-in bold:** term + definition (glossary).

Introduce a list with a complete sentence, not a stem the items complete.

Use parallel syntax. Start items with a capital letter. End with a period if the item is a full sentence or includes a verb; skip end punctuation for a single word, a verb-less phrase, pure code, or a document title.

Don't end in-paragraph lists with *etc.* or *and so on*. Use serial commas.

## Code in prose

Backticks for commands, flags, filenames, paths, HTTP verbs, status codes, env vars, language keywords, JSON keys, and similar. Don't inflect a code token as English (*`GET`ting*); add a noun (*send a `GET` request*).

Not in code font: product names, ordinary domain names, URLs the reader should follow as links.

If a UI control's label is also a code value, use **bold** and code font together.

## UI

Bold the UI label. Don't describe controls by appearance or position (*the bell icon*, *the button on the right*). Use the visible name. `icon="…"` on `<Card>` / `<Step>` / `<Icon>` is decoration next to that name — don't flag it as describing a control by its icon.

Sequential menus: **File > New**.

## Other

- Serial commas.
- Dates: unambiguous (`2026-08-26` or *August 26, 2026*), not `08/26/26`.
- Don't use all-caps or camel case for ordinary prose.
