# formatting

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### callout-type

- **Scan:** `<Info>` / `<Warning>` / `<Error>` / `<Success>` and GitHub alerts
- **Finding if:** type does not match reader need (blocker in `Info`; skippable context in `Error`)
- **Skip if:** the type already matches; do not convert `<Info>` ↔ GitHub alerts; the component's visible heading (Information, Warning, Error, Success)

### stacked-callouts

- **Scan:** adjacent callouts; callouts that hold a prerequisite or the next procedure step; callouts that are only a cross-reference
- **Finding if:** two callouts stack; or a prereq / next step / xref lives in a callout
- **Skip if:** a single matching callout

### dates-times

- **Scan:** dates, times, seasons used as dates
- **Finding if:** ambiguous numeric date (`08/26/26`); season as a date; a time with no timezone
- **Skip if:** ISO (`2026-08-26`) or month-name dates; times that already include a timezone

### numbers-units

- **Scan:** numerals and units in prose
- **Finding if:** numbers one through nine are digits (except measurements, versions, and code); or there is no space before a unit (`10GB` vs `10 GB`)
- **Skip if:** `%` where the product requires no space; code and version numbers

### tables

- **Scan:** every markdown table
- **Finding if:** no introducing sentence before the table; no header row; or the table sits in the middle of a numbered procedure where a list would do
- **Skip if:** `<Property>` on a reference page — do not convert to or from a table when it already fits

### figures

- **Scan:** images and screenshots of code or terminal output
- **Finding if:** `src` is not a path from `docs/` with a leading slash (`/assets/…`); new information exists only in the figure; or code/terminal is a screenshot instead of a fence
- **Skip if:** `![alt](src)` for a simple image (do not demand `<Image>` or convert `<Image>` back); SVG logos and PNG/WebP screenshots that already follow that split; a ` ```mermaid ` fence (valid diagram, not a missing screenshot)

### footnotes-math-video

- **Scan:** `[^`, footnote markup, LaTeX/`$`, and raw video URLs in body copy
- **Finding if:** footnotes; math/KaTeX; a video not using `<YouTube>`, `<Vimeo>`, or `<Video>`
- **Skip if:** none
