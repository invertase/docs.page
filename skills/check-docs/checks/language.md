# language

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### acronyms

- **Scan:** acronyms (2–5 capital letters)
- **Finding if:** unexplained on first mention
- **Skip if:** the expansion already appears on the page; established API or format names (*PDF*, *HTTP*)

### anthropomorphism

- **Scan:** verbs that give software senses or intent (`wants`, `thinks`, `sees`, `tells`, `believes`)
- **Finding if:** the product *wants* / *thinks* / *sees* / *tells*
- **Skip if:** a CLI or wizard *asks* / *prompts* the reader

### articles

- **Scan:** frontmatter `title` and `##` / `###` that name a countable noun
- **Finding if:** *a* / *an* / *the* is missing (*Create VM* vs *Create a VM*)
- **Skip if:** a mass noun or a proper name that never takes an article

### present-tense

- **Scan:** `will`, `would` in body prose
- **Finding if:** general product behavior uses future or hypothetical (*the server will send*)
- **Skip if:** a later result of *this* procedure; quoted legal future tense

### pronouns

- **Scan:** `this` / `these` / `he/she` without a following noun
- **Finding if:** *this* / *these* has no noun; or *he/she* instead of singular *they*
- **Skip if:** the antecedent is the previous noun and is unambiguous

### code-possessive

- **Scan:** `'s` and plural *s* on code tokens and trademarks
- **Finding if:** a code token or mark is pluralized or possessive (*`settings.h`'s*)
- **Skip if:** a noun was added (*the `settings.h` file*)

### invented-contractions

- **Scan:** contractions
- **Finding if:** three-word or invented contractions (*mightn't've*)
- **Skip if:** common two-word contractions (`don't`, `you're`)

### reference-voice

- **Scan:** `<Property>` descriptions and field/method blurbs on reference pages
- **Finding if:** the blurb is an imperative (*Create a task*) instead of third person (*Creates a task*)
- **Skip if:** a how-to page
