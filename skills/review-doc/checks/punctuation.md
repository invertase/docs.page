# punctuation

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### list-colon

- **Scan:** every `:` that introduces a list
- **Finding if:** the stem is not a complete sentence
- **Skip if:** `:` in URLs, fences, and times

### serial-comma

- **Scan:** every list of three or more items in prose
- **Finding if:** the serial (Oxford) comma is missing
- **Skip if:** a two-item list

### fake-em-dash

- **Scan:** `--` in prose
- **Finding if:** `--` is used as a dash
- **Skip if:** `--` in flags

### commas

- **Scan:** introductory phrases; *and* / *but* joining clauses; *which*
- **Finding if:** no comma after a long introductory phrase; two independent clauses joined by *and* / *but* with no comma; a comma splice; restrictive *which* without the comma that a nonrestrictive *which* needs
- **Skip if:** both clauses are very short

### ellipsis

- **Scan:** `...` / `…` in prose and inside fences
- **Finding if:** a prose ellipsis trails off; or a fence uses `...` instead of a comment in that language
- **Skip if:** omitted samples that the surrounding sentence already marks as incomplete

### slashes

- **Scan:** `and/or`, `he/she`, and `/` used as casual *or* in prose
- **Finding if:** those forms appear in body copy
- **Skip if:** paths, URLs, `application/json`; a slash inside a fixed term the product itself uses as one name — a paired setting or control such as previous/next navigation or read/write access — rather than a casual *or*
