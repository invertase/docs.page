# word-list

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

Do not ingest a dictionary. Only the tokens below.

### padding-words

- **Scan:** `please`, `e.g.`, `i.e.`, `etc.`, `and so on`, `utilize`, `leverage`, `commence`, `simply`, `easy`, `quickly`
- **Finding if:** the word is used in the avoid sense (padding, Latin, or *simply* / *easy* / *quickly* in a procedure)
- **Skip if:** the token is a product or API name

### position-and-time

- **Scan:** `once`, `since`, `while`
- **Finding if:** the word could mean time or cause (*once* / *since* / *while*)
- **Skip if:** *see* for a cross-reference; *since* that can only mean *because* in context

### slang

- **Scan:** `tl;dr` and other chat slang
- **Finding if:** the slang appears in body copy
- **Skip if:** a quoted UI string in code font
