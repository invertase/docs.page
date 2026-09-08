# check-docs

Reviews one docs.page MDX page against 16 writing checks. The agent prints a scoreboard after **every** run and loops until failing is 0 (cap 3).

Agent instructions: [SKILL.md](SKILL.md).

## Invoke

Name the skill and the page:

```text
use check-docs on docs/features/components.mdx
```

```text
use check-docs on docs/index.mdx and auto fix findings
```

Work one page at a time. `docs/` is relative to the project root (`docs.json` at the root).

## After each run

The agent prints a scoreboard, then a violation list when anything is failing. You get that output after run 1, after run 2, and after run 3 — not only at the end.

```text
> 16 checks · 2 failing · 1 muted · 13 passing  docs/index.mdx

CHECK                     STATUS      VIOLATIONS  MUTED  DESCRIPTION
person-and-voice          passing     -           -      you not we; one person; active voice
inline-formatting         failing     2           -      code font; UI bold; list shape
tone                      muted       -           1      no idioms, padding, or pre-announcement
```

Then, for failing checks only:

```markdown
## Violations
1. `tone-1` — <what to change>
   Evidence: `<quote>`
   Do this: <concrete edit>
```

When two checks collide on the same quote: `` `inline-formatting-1` (conflicts: `tone`) ``.

When `failing == 0`, you get the scoreboard with no violation list.

## Choose a mode

After the first scoreboard (unless you already said **fix all**):

```text
fix all
```

```text
review each
accept tone-1
reject links-2
mute check tone
```

| Command | Effect |
| --- | --- |
| `fix all` | Accept every unmuted finding, apply, rerun. Scoreboard still prints after each run. |
| `review each` | Wait. You accept or reject by id. |
| `reject <id>` | Mute that instance. |
| `mute check <id>` | Mute every instance of that check. |

**Fix all** still prints the scoreboard for the run it just finished, then applies, then prints the next run. Do not expect a single final-only table.

Cap is 3 runs. If failing is still above 0, the last scoreboard lists what is left.

## Checks

Scoreboard order:

1. [person-and-voice](checks/person-and-voice.md) — you not we; one person; active voice
2. [procedures](checks/procedures.md) — numbered sequences; one action per step
3. [headings](checks/headings.md) — frontmatter; sentence case; no `#` in the body
4. [inline-formatting](checks/inline-formatting.md) — code font; UI bold; list shape
5. [links](checks/links.md) — descriptive text; root-relative in-site URLs
6. [tone](checks/tone.md) — no idioms, padding, or pre-announcement
7. [general-principles](checks/general-principles.md) — claims, jargon, inclusive language
8. [language](checks/language.md) — acronyms, tense, anthropomorphism
9. [sentence-structure](checks/sentence-structure.md) — condition before the instruction
10. [punctuation](checks/punctuation.md) — list stems, serial comma, dashes
11. [text-formatting](checks/text-formatting.md) — bold, italics, `&`
12. [formatting](checks/formatting.md) — callouts, dates, tables, figures
13. [computer-interfaces](checks/computer-interfaces.md) — fences, placeholders, commands
14. [names](checks/names.md) — product spelling, filenames, example hosts
15. [word-list](checks/word-list.md) — please, e.g., utilize, simply, easy
16. [accessibility-and-global](checks/accessibility-and-global.md) — alt, position words, sentence length

Each check is one worker. The parent does not scan unless the host cannot spawn subagents.

## Logs

Written to `logs/<page-slug>.json` (`docs/index.mdx` → `docs--index.mdx.json`). Field shape: [logs/example.json](logs/example.json).

Live page logs are gitignored. `example.json` stays in the repo.

## Gotchas the agent must keep

- Do not invent pages, procedure steps, prerequisites, or information architecture.
- Do not convert between equivalent docs.page forms (`<Info>` ↔ GitHub alerts; `![alt](src)` ↔ `<Image>`; `<Property>` ↔ a short markdown table; `<Tabs>` / `<TabItem>` naming).
- Do not apply a fix that would make the page worse.
- Missing tags in converted HTML are not findings — re-fetch raw MDX.
