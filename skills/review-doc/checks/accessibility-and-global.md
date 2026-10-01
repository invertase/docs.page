# accessibility-and-global

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### alt

- **Scan:** `![` and `<Image`
- **Finding if:** `alt` is missing or empty of meaning
- **Skip if:** `icon="…"` / `<Icon>` (no `alt` required); a ` ```mermaid ` fence is not a missing image

### position-words

- **Scan:** `above`, `below`, `left`, `right` for on-page position
- **Finding if:** the word locates something on the page instead of naming it (*preceding*, *following*, or the element)
- **Skip if:** `left` / `right` in a product UI label

### sentence-length

- **Scan:** sentence word counts in body prose
- **Finding if:** more than 26 words; or a double negative
- **Skip if:** word count inside fences

### uncommon-words

- **Scan:** `bespoke` and other non-primary-sense words in body copy
- **Finding if:** a rarer word where a primary-sense word exists (*use* not *bespoke*)
- **Skip if:** a defined product term

### walls-of-text

- **Scan:** stretches of body with no `##` for more than about four paragraphs
- **Finding if:** a wall of text with no heading break
- **Skip if:** `<Accordion>` body (do not promote `title` to `##`)

### global

- **Scan:** holidays, sports metaphors, seasons as dates
- **Finding if:** a holiday, sport, or season stands in for a date or a joke
- **Skip if:** dated release notes that name a real calendar date
