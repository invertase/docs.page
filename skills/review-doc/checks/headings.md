# headings

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### frontmatter

- **Scan:** YAML `title` and `description`
- **Finding if:** `title` is missing; or `description` is missing on a page that has a body
- **Skip if:** none for `title`; a stub with no body for `description`

### hash-title

- **Scan:** every ATX heading in the body
- **Finding if:** a `#` heading repeats the page title
- **Skip if:** `##` / `###` body headings; bold **Before you begin** above a prereq list

### links-in-headings

- **Scan:** every `##` / `###` / `#`
- **Finding if:** the heading contains a markdown or MDX link
- **Skip if:** none

### heading-levels

- **Scan:** ATX heading levels in body order
- **Finding if:** a level is skipped (`##` then `####`); or the heading is empty
- **Skip if:** component `title` / `label` / fence `title="…"`

### sentence-case

- **Scan:** frontmatter `title` and every `##` / `###`
- **Finding if:** a word other than the first, the first after a colon, or a proper noun is capitalized; or the heading ends with a period
- **Skip if:** component `title` / `label` / fence `title="…"`

### task-ing

- **Scan:** every `##` / `###` and `title`
- **Finding if:** a how-to heading starts with *-ing* (*Creating an instance*) instead of a bare infinitive (*Create an instance*); or a concept heading is a gerund instead of a noun phrase
- **Skip if:** an established label (*Billing*); component titles

### code-in-heading

- **Scan:** code spans inside `##` / `###` / `title`
- **Finding if:** a code token stands alone with no noun (*`docs.json`* vs *the `docs.json` file*)
- **Skip if:** none

### optional-heading

- **Scan:** `(optional)` / `(Optional)` on `##` / `###` / `title`
- **Finding if:** optional is in parentheses on the heading instead of `Optional:` as a prefix
- **Skip if:** `Optional:` already

### following-sections

- **Scan:** `this section` / `these sections` / `the following sections`
- **Finding if:** a sentence that introduces a group of subsections says *this section*
- **Skip if:** it refers to the current single section only

### markdown-over-heading-tag

- **Scan:** `<Heading`
- **Finding if:** `<Heading>` is used where a Markdown `##` would appear in **On this page**
- **Skip if:** inside a component that does not parse Markdown
