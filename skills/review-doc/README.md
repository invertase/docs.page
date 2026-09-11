# review-doc

A writing review for one docs.page page. Name a file under `docs/`, get results for 16 checks, then unmuted findings are applied so you can review the page diff. This is not the `docs check` CLI command (broken links, assets, render).

Paths are relative to the project root (`docs.json` lives there).

## Review one page

```text
use review-doc on docs/features/components.mdx
```

Results print first, then every unmuted violation is applied except a heading rewrite that would change that section's in-page link (`#slug`). Those stay in the list until you `accept` them — update any `/page#slug` links in the same change. Review the page diff. Say `review each` in the same request if you want to decide before anything is written.

## Review several pages

Reviews are one page at a time. When a page is clean (or you stop), start a new review on the next file:

```text
use review-doc on docs/quickstart.mdx
```

```text
use review-doc on docs/authoring/write.mdx
```

There is no folder-wide or glob run. Name each page you want reviewed.

## Read the results

You get results after **every** run — not only when the page is clean. The summary line and checks table come first; failing checks then list violations grouped under a heading per check.

```text
> 16 checks · 2 failing · 1 muted · 13 passing  docs/index.mdx

CHECK                     STATUS      VIOLATIONS  MUTED  DESCRIPTION
person-and-voice          passing     -           -      you not we; one person; active voice
inline-formatting         failing     1           -      code font; UI bold; list shape
tone                      failing     1           -      no idioms, padding, or pre-announcement
word-list                 muted       -           1      please, e.g., utilize, simply, easy
```

```markdown
## Violations

### inline-formatting
1. `inline-formatting-1` — <what to change>
   Evidence: `<quote>`
   Do this: <concrete edit>

### tone
1. `tone-1` — <what to change>
   Evidence: `<quote>`
   Do this: <concrete edit>
```

If two checks disagree on the same quote, they share one item: `` `inline-formatting-1` (conflicts: `tone`) ``.

When `failing` is 0, you get the table only. Ask again on that page to reprint it.

## Fix or skip violations

By default, after the results print, every unmuted violation is accepted, applied, and the review runs again. A heading rewrite that would change its `#slug` is not auto-applied; it stays failing until you `accept <id>` (or reject/mute). You still see results for the run that just finished, then the next run. Review the page diff. Mute does not undo edits already written; revert the file.

A page stops after 3 runs, or sooner if the only leftovers are those held headings. If failing is still above 0, the last results list what remains.

`fix all` is the same as the default.

### Decide one by one

```text
review each
accept tone-1
reject links-2
```

| You say | What happens |
| --- | --- |
| `review each` | Pause. Nothing is applied until you decide. |
| `accept tone-1` | Apply that violation. |
| `reject links-2` | Keep the current wording. That instance is muted and will not come back on later runs. |

You can mix `accept` and `reject` in the same reply. Only accepted edits are written to the page. To mute a check before any edit, say `review each` first, or include `mute check <id>` in the review request.

### Mute a whole check

```text
mute check tone
```

Every instance of that check on this page is muted, in the default apply path or **review each**. Muted checks stay muted on later runs of the same page.

### Unmute

Muted instances stay muted unless you ask to reopen them, for example:

```text
unmute tone-1
```

```text
unmute check tone
```

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

Live page logs stay local (gitignored). `example.json` is the schema specimen. Mutes for a page live in that log, so a later review of the same file keeps them.

## What it will not change

- Invented pages, procedure steps, prerequisites, or information architecture
- Equivalent docs.page forms (`<Info>` ↔ GitHub alerts; `![alt](src)` ↔ `<Image>`; `<Property>` ↔ a short markdown table; `<Tabs>` / `<TabItem>` naming)
- An edit that would make the page worse
- Missing tags in converted HTML — those are not violations; the review uses raw MDX
