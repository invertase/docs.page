# check-docs

A writing review for one docs.page page. Point it at a file under `docs/`, get a scoreboard of 16 checks, then auto-fix or accept and reject each finding.

You work one page at a time. Paths are relative to the project root (`docs.json` lives there).

## Run a review

In Cursor, name the page:

```text
use check-docs on docs/features/components.mdx
```

Apply every unmuted finding in the same request:

```text
use check-docs on docs/index.mdx and auto fix findings
```

## Read the scoreboard

You get a scoreboard after **every** run — not only when the page is clean.

```text
> 16 checks · 2 failing · 1 muted · 13 passing  docs/index.mdx

CHECK                     STATUS      VIOLATIONS  MUTED  DESCRIPTION
person-and-voice          passing     -           -      you not we; one person; active voice
inline-formatting         failing     2           -      code font; UI bold; list shape
tone                      muted       -           1      no idioms, padding, or pre-announcement
```

Failing checks then list each finding:

```markdown
## Violations
1. `tone-1` — <what to change>
   Evidence: `<quote>`
   Do this: <concrete edit>
```

If two checks disagree on the same quote, they share one item: `` `inline-formatting-1` (conflicts: `tone`) ``.

When `failing` is 0, you get the table only.

## Fix findings

After the first scoreboard, choose a mode (skip this if you already asked to auto-fix):

```text
fix all
```

```text
review each
accept tone-1
reject links-2
mute check tone
```

| You say | What happens |
| --- | --- |
| `fix all` | Accept every unmuted finding, apply it to the page, and run again. |
| `review each` | Pause. You decide per finding. |
| `accept tone-1` | Apply that finding. |
| `reject links-2` | Keep the current wording. That instance stays muted. |
| `mute check tone` | Mute every instance of that check on this page. |

**Fix all** still shows the scoreboard for the run it just finished, then applies, then shows the next run.

A review stops at 3 runs. If failing is still above 0, the last scoreboard lists what remains.

## What it checks

| Check | Looks for |
| --- | --- |
| [person-and-voice](checks/person-and-voice.md) | you not we; one person; active voice |
| [procedures](checks/procedures.md) | numbered sequences; one action per step |
| [headings](checks/headings.md) | frontmatter; sentence case; no `#` in the body |
| [inline-formatting](checks/inline-formatting.md) | code font; UI bold; list shape |
| [links](checks/links.md) | descriptive text; root-relative in-site URLs |
| [tone](checks/tone.md) | no idioms, padding, or pre-announcement |
| [general-principles](checks/general-principles.md) | claims, jargon, inclusive language |
| [language](checks/language.md) | acronyms, tense, anthropomorphism |
| [sentence-structure](checks/sentence-structure.md) | condition before the instruction |
| [punctuation](checks/punctuation.md) | list stems, serial comma, dashes |
| [text-formatting](checks/text-formatting.md) | bold, italics, `&` |
| [formatting](checks/formatting.md) | callouts, dates, tables, figures |
| [computer-interfaces](checks/computer-interfaces.md) | fences, placeholders, commands |
| [names](checks/names.md) | product spelling, filenames, example hosts |
| [word-list](checks/word-list.md) | please, e.g., utilize, simply, easy |
| [accessibility-and-global](checks/accessibility-and-global.md) | alt, position words, sentence length |

## Review history

Each run appends to `logs/<page-slug>.json` (`docs/index.mdx` → `docs--index.mdx.json`). Field shape: [logs/example.json](logs/example.json).

Live page logs stay local (gitignored). `example.json` is the schema specimen.

## What it will not change

- Invented pages, procedure steps, prerequisites, or information architecture
- Equivalent docs.page forms (`<Info>` ↔ GitHub alerts; `![alt](src)` ↔ `<Image>`; `<Property>` ↔ a short markdown table; `<Tabs>` / `<TabItem>` naming)
- An edit that would make the page worse
- Missing tags in converted HTML — those are not findings; the review uses raw MDX
