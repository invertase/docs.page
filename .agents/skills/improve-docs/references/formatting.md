# Formatting and organization

Lists: [lists-and-formatting.md](lists-and-formatting.md). Procedures: [procedures.md](procedures.md). Headings: [headings.md](headings.md). Text styles: [text-formatting.md](text-formatting.md).

## Paragraphs

One idea per paragraph. Important point first. Short sentences. Left-align (the theme does this). Don't force hard line breaks inside a paragraph.

## Dates, times, numbers, units, phones

- Dates: `2026-08-26` or *August 26, 2026*, not `08/26/26` or seasons as dates.
- Times: include timezone.
- Spell out numbers one through nine in prose except measurements, versions, and code.
- Space between number and unit (`10 GB`) except `%` where the product requires otherwise.
- Phone examples: fictitious international format. Never real numbers.

## Tables

Introduce the table in the preceding sentence. Use a Markdown table with a header row. Don't merge cells (Markdown can't). Don't drop a table in the middle of a numbered procedure if a list would do. On a reference page, `<Property>` and a short markdown table are both valid — don't convert one into the other when it already fits.

## Callouts

Use docs.page callouts, not generic Note or Caution HTML. `<Info>` / `<Warning>` / `<Error>` / `<Success>` and GitHub alerts (`> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`) render the same panels — don't convert one form to the other. Don't flag missing callouts if the live page already shows them; converters strip the tags. Types:

| Component | Use |
|---|---|
| `<Info>` (or `> [!NOTE]`) | Helpful context the reader can skip and still succeed |
| `<Warning>` (or `> [!WARNING]` / `[!IMPORTANT]`) | Caution before an action |
| `<Error>` (or `> [!CAUTION]`) | Blocker, failure, or requirement that stops progress |
| `<Success>` (or `> [!TIP]`) | Confirmation that a step worked |

There is no generic `<Note>`. Don't stack callouts. Don't put prerequisites or the next procedure step in a callout. Don't use a callout for a cross-reference.

## Images and examples

Repo images: path from `docs/` with a leading slash (`/assets/dashboard.png`). Markdown `![alt](src)` is enough for simple cases and already renders through `<Image>`. Don't demand the `<Image>` tag unless you need captions, light/dark variants, width, or per-image zoom (`content.zoomImages` in `docs.json` is the site default).

Always set meaningful `alt` (docs.page uses empty `alt` if you omit it). Don't put new information only in a figure. Don't screenshot code or terminal output — use a fence. SVG for logos; PNG or WebP for screenshots.

Video: `<YouTube>`, `<Vimeo>`, or `<Video>` (public `https` URL only).

## Footnotes and math

Don't use footnotes. Use a link, callout, or parenthetical. docs.page has no math/KaTeX component — write the idea in prose or a table.
