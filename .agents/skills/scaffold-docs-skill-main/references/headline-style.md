# Headline style

Load this before naming any reader-facing section. It applies at the three structural passes that coin section names: Phase 1e, Phase 2 Pass A, and Phase 3 Pass A.

## The rule

Name a section by the action the reader takes, not the bare noun behind it. Lead with a verb, often a gerund. The benefit shows through the action you name. You never assert it.

`Optimizers` → `Defining metrics and optimizing programs`

The noun names a thing in the code. The action names what the reader came to do. A reader scanning headlines is hunting for their task, not your class list.

## Show the benefit through the action, never assert it

The value lives in the action you name, not in adjectives about it. `Defining metrics and optimizing programs` earns its value by naming a capability the reader wants. It never says *easily* or *powerful*. A headline that reaches for value-words has stopped showing and started selling.

Showing the outcome is good. It stays concrete and names what happens: *against a metric*, *across runs*, *so they're trusted*. Telling about quality is banned. It is subjective and unfalsifiable: *easily*, *powerful*, *seamless*.

| Selling | Showing |
|---|---|
| Effortlessly optimize your pipeline | Optimizing programs against a metric |
| Powerful, flexible caching | Reusing results across runs |
| Simple, secure authentication | Signing requests so they're trusted |

Banned in headlines, in the same spirit as the filler words in `prose-style.md`: *effortless*, *powerful*, *simple*, *easy*, *seamless*, *blazing*, *robust*, *flexible*, *rich*, *comprehensive*, and other value-adjectives.

## Don't define the library against alternatives

A headline names what this library does. It never names how the library beats something else. Drop *better than*, *unlike clunky X*, *the modern alternative to Y*, *faster than Z*. Badmouthing alternatives is telling at its worst, and it dates fast as the competition changes.

| Positioning against | Showing what it does |
|---|---|
| A better way to manage state | Managing state with signals |
| Faster than the standard client | Streaming responses as they arrive |
| Unlike traditional ORMs | Querying with typed models |

Neutral orientation for migrators is fine. `Coming from Express` points the reader to the right page without disparaging anyone. The ban is on superiority claims, not on every mention of another tool.

## Self-check

Run both prongs on every headline before you keep it.

1. Strip every adjective. If the headline loses meaning, that meaning was hype. If it reads the same, the adjective was never working.
2. Does the headline imply another tool is worse? Cut the comparison and name what this library does.

## Where this applies

Apply the rule to reader-facing topic titles and content groupings in Getting Started and Diving Deeper.

Do not apply it to:

- Phase 3's fixed structural labels (Intent, Design decisions, API walkthrough). These are scaffolding, not topic headlines.
- Reference. Reference headers are literal symbol names (`Optimizer`, `compile()`) so readers can scan for the exact name they need.
