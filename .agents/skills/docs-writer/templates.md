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

$OPENING_SENTENCE

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

**Forbidden in tutorials:** API reference tables, long concept sections, "alternatively" branches, production hardening.

---

## How-To

**When:** Specific problem, experienced user, recipe format.

```mdx
---
title: $HOW_TO_TITLE
description: $PROBLEM_OUTCOME
---

$PROBLEM_STATEMENT

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

**Optional:** Use `<Steps>` instead of ordered list when steps are long or include screenshots.

---

## Reference

**When:** APIs, schemas, CLI flags, config keys, component props — lookup, not narrative.

```mdx
---
title: $SURFACE_NAME
description: $REFERENCE_DESCRIPTION
---

$AUSTERE_INTRO

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

**Forbidden in reference:** "Welcome", tutorials, analogies, marketing adjectives, step-by-step workflows (link out).

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

## Design tradeoffs

$TRADEOFFS

## Related

- $TUTORIAL_LINK
- $REFERENCE_LINK
- $HOWTO_LINK
```

**Forbidden in explanation:** Step-by-step setup (link to Tutorial/How-To), exhaustive field lists (link to Reference).

---

## Frontmatter and metadata

| Field | Required | Guidance |
| --- | --- | --- |
| `title` | yes | Match doc type: Tutorial = outcome; How-To = "How to …"; Reference = noun phrase |
| `description` | yes | &lt; 160 chars where possible; no fluff |
| `image` | no | Rare; use for high-traffic landing pages only |

---

## Choosing components

| Doc type | Preferred components |
| --- | --- |
| Tutorial | `<Steps>`, `<Info>` for prerequisites |
| How-To | `<Steps>` or ordered lists, `<Warning>` |
| Reference | `<Property>`, `<Accordion>`, tables |
| Explanation | Prose, `<Cards>` for related links, mermaid only if user/project uses it |
