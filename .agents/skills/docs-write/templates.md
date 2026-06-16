# Diátaxis page templates

Use these skeletons after routing. Substitute every `$TOKEN` with real content; delete sections that do not apply. Do not mix sections across doc types. Never ship `$TOKEN` literals in output.

---

## Tutorial

**When:** First-time user, learning path, safe sandbox, single small outcome.

```mdx
---
title: $CONCRETE_OUTCOME
description: $FINISHED_OUTCOME
---

$SCOPE_AND_SETUP

## Prerequisites

- $PREREQUISITE
- $REFERENCE_LINK

## Steps

<Steps>
  <Step title="$VERB_LED_TITLE">
    $IMPERATIVE_INSTRUCTION

    ```bash
    $COMMAND
    ```

    $EXPECTED_RESULT
  </Step>
  <Step title="$VERB_LED_TITLE">
    ...
  </Step>
</Steps>

## Next steps

- $HOWTO_LINK
- $EXPLANATION_LINK
```

**Opening paragraph (`$SCOPE_AND_SETUP`):** What the reader will do in *this* guide and any sandbox constraints — not a restatement of `$FINISHED_OUTCOME`. Example: *"In this guide you create a preview project and publish it to a test branch."*

**Forbidden in tutorials:** API reference tables, long concept sections, "alternatively" branches, production hardening.

---

## How-To

**When:** Specific problem, experienced user, recipe format.

```mdx
---
title: $HOW_TO_TITLE
description: $PROBLEM_OUTCOME
---

$WORKFLOW_CONTEXT

## Before you begin

- $PREREQUISITE
- $REFERENCE_LINK

## Steps

1. **$WHY_FIRST** $IMPERATIVE_ACTION

   ```json
   $CONFIG_OR_COMMAND
   ```

2. **$NEXT_ACTION** ...

## Verify

$VERIFY_INSTRUCTION

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| $SYMPTOM | $CAUSE | $FIX |

## Next steps

- $RELATED_HOWTO
- $REFERENCE_LINK_FULL
```

**Opening paragraph (`$WORKFLOW_CONTEXT`):** Optional. When present: where this task fits in the reader's workflow, scope boundaries, or a constraint — **not** a restatement of `$PROBLEM_OUTCOME`. Example: *"After local preview looks right, run check in CI before you merge."* When absent: start directly at `## Before you begin`.

**Optional:** Use `<Steps>` instead of ordered list when steps are long or include screenshots.

---

## Reference

**When:** APIs, schemas, CLI flags, config keys, component props — lookup, not narrative.

```mdx
---
title: $SURFACE_NAME
description: $REFERENCE_DESCRIPTION
---

$SYNTAX_POINTER

## $GROUP_NAME

<Property name="$KEY" type="$TYPE" required>
  $BEHAVIOR

  ```json
  $EXAMPLE_VALUE
  ```
</Property>

---

<Property name="$KEY" type="$TYPE">
  ...
</Property>

## $NESTED_GROUP

<Accordion title="$GROUP_NAME">
  <Property name="$KEY" type="$TYPE">
    ...
  </Property>
</Accordion>

## Errors

| Code / condition | Meaning |
| --- | --- |
| $ERROR_VALUE | $ERROR_MEANING |

## See also

- $EXPLANATION_LINK
- $HOWTO_LINK
```

**Forbidden in reference body:** "Welcome", tutorials, analogies, marketing adjectives, step-by-step workflows (link out). These limits do **not** apply to frontmatter `description` — metadata should still use reader-benefit voice.

**Reference tokens:**

| Token | Voice |
| --- | --- |
| `$REFERENCE_DESCRIPTION` | Reader benefit: when/why to use this surface — imperative or *you*-focused (*"Organize content into switchable panels for options, platforms, or languages"*). Not a prop list or inventory summary. |
| `$SYNTAX_POINTER` | Optional. When present: syntax anchor or where values live (*"Set fields under the `theme` key in `docs.json`."*) — **not** a restatement of `$REFERENCE_DESCRIPTION`. When absent: start directly at the first `##` group. |

---

## Explanation

**When:** Architecture, design decisions, mental models, *why*.

```mdx
---
title: $CONCEPT_NAME
description: $UNDERSTANDING_GAINED
---

$HOOK

## Overview

$MENTAL_MODEL

## How it works

$DISCURSIVE_SECTION

### $SUBCONCEPT_A

$SUBCONCEPT_A_BODY

### $SUBCONCEPT_B

$SUBCONCEPT_B_BODY

## Related

- $TUTORIAL_LINK
- $REFERENCE_LINK
- $HOWTO_LINK
```

**Opening paragraph (`$HOOK`):** A question, tension, or scenario that pulls the reader in — **not** a restatement of `$UNDERSTANDING_GAINED`.

**Structure:** Hook → Overview → How it works → Related. Do **not** add a standalone `## Design tradeoffs` section by default. When rationale or consequences matter, weave them into `## How it works` (or a named subsection there) — keep the page focused on the mental model the outline asks for.

**Forbidden in explanation:** Step-by-step setup (link to Tutorial/How-To), exhaustive field lists (link to Reference), boilerplate tradeoffs sections that repeat Introduction or comparison pages.

---

## Frontmatter and metadata

| Field | Required | Guidance |
| --- | --- | --- |
| `title` | yes | Match doc type: Tutorial = outcome; How-To = "How to …"; Reference = noun phrase |
| `description` | yes | &lt; 160 chars where possible. **Reader benefit:** when/why to open this page. Imperative or *you*-focused. Not a feature inventory, prop list, or inventory `summary` paraphrase. |
| `image` | no | Rare; use for high-traffic landing pages only |

## Description vs opening paragraph

These fields answer **different questions**. Never paraphrase the opening from `description` or vice versa.

| Field | Question it answers | Where it appears |
| --- | --- | --- |
| `description` | Why would I open this page? | Frontmatter — search, nav, social previews |
| Opening paragraph | What is my entry point on this page? | First body content before the first `##` |

### Role split by doc type

| Doc type | `description` | Opening paragraph |
| --- | --- | --- |
| Tutorial | Outcome when finished (`$FINISHED_OUTCOME`) | Scope and setup (`$SCOPE_AND_SETUP`) — what happens *in this guide* |
| How-To | Problem solved (`$PROBLEM_OUTCOME`) | Workflow context (`$WORKFLOW_CONTEXT`) — **optional**; omit if `## Before you begin` suffices |
| Reference | When/why to use this surface (`$REFERENCE_DESCRIPTION`) | Syntax pointer (`$SYNTAX_POINTER`) — **optional**; omit if the first `##` group is self-explanatory |
| Explanation | Insight gained (`$UNDERSTANDING_GAINED`) | Hook (`$HOOK`) — scenario or question, not the insight restated |

### Duplication test

Before delivering, read `description` and the opening paragraph aloud. **Fail** if they:

- Share the same leading verb or command (e.g. both start with "Run `docs check`…")
- Restate the same outcome in different words
- Could be merged into one sentence without losing information

**Fix:** Keep `description` as the benefit. Rewrite or **delete** the opening paragraph.

**Description tokens by doc type:**

| Doc type | Frontmatter token | Aim |
| --- | --- | --- |
| Tutorial | `$FINISHED_OUTCOME` | What the reader will have done when finished |
| How-To | `$PROBLEM_OUTCOME` | The problem solved or result achieved |
| Reference | `$REFERENCE_DESCRIPTION` | When/why to use this API, component, or config surface |
| Explanation | `$UNDERSTANDING_GAINED` | What mental model or insight the reader takes away |

---

## Choosing components

Component selection and published references: [components.md](components.md).
