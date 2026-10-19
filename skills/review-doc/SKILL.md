---
name: review-doc
description: Reviews a docs.page page against writing checks (failing, passing, muted), prints a results table, and applies unmuted findings by default so the publisher can review the diff. Loops until failing is 0, or until only heading rewrites that would change an anchor slug remain (those wait for accept). Use when the publisher names review-doc or review doc, or asks to review writing on a docs/*.mdx page. Not the docs check CLI (links, assets, render).
---

# review-doc

The parent orchestrates. It does not scan unless the host cannot spawn subagents — then it runs one worker at a time. Each check in **Checks** is one worker.

Work one page at a time. `checks/` and `logs/` are relative to this skill; `docs/` is relative to the project root (`docs.json` at the root). Publisher-facing usage is in [README.md](README.md).

## Gotchas

- Do not invent pages, procedure steps, prerequisites, audience, or information architecture.
- Do not convert between equivalent docs.page forms (`<Info>` ↔ GitHub alerts; `![alt](src)` ↔ `<Image>`; `<Property>` ↔ a short markdown table; `<Tabs>` / `<TabItem>` naming).
- Do not apply a fix that would make the page worse.
- Do not auto-apply a **held heading rewrite**: an edit that changes a `##` / `###` / `#` line (any check, not only `headings`) to wording that slugifies to a different id. Slugify: lowercase, strip non-alphanumerics, spaces to hyphens (`Set up iOS` → `set-up-ios`; duplicates get `-1`, `-2`). Sentence case or a trailing period that keep the same id may apply. Leave the heading and `decision: null`; the publisher `accept`s it and renames the heading and the `/page#slug` links together.
- If the live page already shows steps, callouts, tabs, cards, or images, re-fetch raw MDX — missing tags in converted HTML are not findings.

## Loop

1. Read `logs/<page-slug>.json` if it exists (`docs/index.mdx` → `docs--index.mdx.json`).
2. Run checks. Merge findings. Write the log (pending `decision: null` is OK until they choose).
3. **Print** the **Results** as a user-visible message. If `failing > 0`, list violations grouped under a heading per failing check. Do this after **every** run — including reruns under **fix all**, the stop run, and the cap run. The log is not a substitute. Do not skip, defer, or collapse runs into a final-only summary. Do not wait until `failing == 0` or the loop ends.
4. Default is **fix all**. Print this run first, then continue step 5. Do not wait for a mode choice. **Review each** only if they asked to review each, not apply, or decide one by one. If they already said **fix all** or auto-fix, same path as the default.
5. **Fix all:** set every unmuted finding except a held heading rewrite to `accepted`, apply, and continue this loop (step 7). If the only leftover unmuted findings are held heading rewrites, stop the auto-loop — do not rerun. **Review each:** wait. Publisher marks `accepted` or `rejected` by id (`tone-1`). Reject mutes that instance. `mute check <id>` mutes every instance of that check in either mode. `unmute <id>` reopens that instance. `unmute check <id>` reopens that check. Mute does not revert edits already written; the publisher reverts the file.
6. Apply only `accepted` edits. Do not auto-apply a held heading rewrite. An explicit `accept <id>` applies even when the slug changes. Do not edit completed runs. The only in-place update is `decision` / `feedback` while still `null`.
7. If they ask again, or **fix all** is still in progress, and `failing > 0` for reasons other than held heading rewrites, rerun **failing checks** and any check whose text sits in the accepted-edit **delta**. Do not rerun `passing` or `muted` on unchanged sentences. Then go to step 3 and print that run before applying or spawning another.
8. **Stop** when `failing == 0`, or when the only remaining unmuted findings are held heading rewrites. Print the results; omit the violation list only when `failing == 0`. If they ask again, reprint that summary.
9. Cap at **3 runs**. If still failing for reasons other than held heading rewrites, stop, print the results and leftover failing checks.

### Publisher example

```text
use review-doc on docs/index.mdx
```

```text
review each
accept tone-1
reject links-2
mute check tone
unmute tone-1
unmute check tone
```

## Run checks

Spawn **one subagent per check** in **Checks**, all in one parallel batch. On later runs, spawn only the checks from loop step 7. If the host cannot spawn subagents, run the same workers sequentially.

Each worker prompt (`<skill>` is this skill directory):

```text
You are review-doc worker `<id>`.
Read the page <path> and <skill>/checks/<id>.md.
Do not edit. Do not read other checks. Do not write the log.
Obey Gotchas (no invented steps/audience/IA, no MDX conversion, no worse page, converted HTML is not a finding).
Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.
Return JSON only:
{
  "check": "<id>",
  "scans": [{ "id": "<heading slug>", "status": "hit" | "clean" | "skip" }],
  "findings": [{ "evidence": "<quote>", "recommendation": "<edit>" }]
}
`scans` must include every ### heading in checks/<id>.md.
```

A missing scan id, missing JSON, or wrong `check` is an orchestrator error: retry that worker once, then log the check as missing (not passing).

After merge, ignore worker-level pass/fail. Drop findings whose `check + normalized evidence` is already muted, or whose check was `mute check <id>`.

Group remaining findings whose evidence overlaps (same quote, or one quote contains the other).

- If the recommendations can both apply, keep both.
- If they cannot, do not log two independent accept/reject items. Emit one finding: `check` is the earlier id in **Checks**, `conflicts` is the other check ids, `recommendation` is a single edit that satisfies every check in the group. If no single edit works, say so in `recommendation` and leave `decision` null.

Assign stable ids `<check>-1`, `<check>-2`, … (counter per check, **Checks** order). Then set each check:

- `failing` — one or more unmuted violations (a check named only in `conflicts` still fails)
- `passing` — every Scan finished, zero violations
- `muted` — remaining violations are all muted; no unmuted failures

A missing check in the log means it was not scanned. Do not reopen muted instances unless the publisher asks.

## Results

Print this as a user-visible message after every run, **before** applying edits or starting the next run. Print it first in that message. Monospace columns, no grid. Zero counts in the table are `-`. If the host colors text, failing is red, muted is yellow, passing is green.

A run that is not printed to the publisher is an orchestrator error. Fix-all already in the request, a planned later run, or an unchanged passing row is not a reason to hide this run's results.

```text
> 16 checks · 2 failing · 1 muted · 13 passing  docs/index.mdx

CHECK                     STATUS      VIOLATIONS  MUTED  DESCRIPTION
person-and-voice          passing     -           -      you not we; one person; active voice
inline-formatting         failing     1           -      code font; UI bold; list shape
tone                      failing     1           -      no idioms, padding, or pre-announcement
word-list                 muted       -           1      please, e.g., utilize, simply, easy
```

One row per check in **Checks** order. Description is the one-liner in **Checks**, or the dominant violation.

Then violations for **failing** checks only, grouped under a `### <check>` heading per check, in **Checks** order. Restart numbering under each heading. Do not list muted checks here.

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

When `conflicts` is non-empty: `` `inline-formatting-1` (conflicts: `tone`) ``. List the item under the finding's `check` (the earlier id).

A held heading rewrite still lists under **Violations**. Mark it held (`accept headings-1` to apply; the new wording would change the `#slug`).

## Log

Write `logs/<page-slug>.json` in loop step 2, before the print. Create `{ "skill": "review-doc", "page": "docs/index.mdx", "runs": [] }` if needed. Append a run matching the field shape in [logs/example.json](logs/example.json). `sourceRoot` and `projectRoot` are `.`. Do not edit completed runs. The only in-place update is `decision` / `feedback` while still `null`.

Every live run must include `summary` and a `checks` array with every id in **Checks**. `findings` are the violation list (`id` is `<check>-n`; `check` is the check id; `conflicts` is an array of other check ids, `[]` when none). The example shows field shape, not a full check list.

## Checks

Checks table order. Spawn one worker per file; read that file only when that worker runs.

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
