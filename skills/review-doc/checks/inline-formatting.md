# inline-formatting

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### code-font

- **Scan:** every filename, path, command, flag, env var, HTTP code, JSON key, and language keyword in prose
- **Finding if:** the token is not in code font; or a code token is inflected as English (*`GET`ting*)
- **Skip if:** product names; URLs the reader should follow as links; MDX attribute values

### ui-bold

- **Scan:** every UI label in prose (button, menu, tab, field)
- **Finding if:** the visible name is not **bold**; or the control is described by appearance or icon shape (*the bell icon*) instead of its name
- **Skip if:** `icon="…"` next to an already-named control; MDX attribute values

### ui-and-code

- **Scan:** UI labels that are also code values
- **Finding if:** the label is bold or code, but not both
- **Skip if:** it is only a UI name or only a code token, not both

### sequential-menus

- **Scan:** two or more menu or UI clicks in sequence
- **Finding if:** they are not written **File > New**
- **Skip if:** a single control

### list-of-one

- **Scan:** bulleted and numbered lists
- **Finding if:** the list has one item
- **Skip if:** a one-sentence instruction not in a list; a glossary run-in

### list-parallel

- **Scan:** items in each list of two or more
- **Finding if:** syntax is not parallel; or an item that is a full sentence / has a verb does not start with a capital and end with a period; or a verb-less phrase / code / title has end punctuation
- **Skip if:** a list of one (already covered)
