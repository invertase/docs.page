# docs.page MDX components

Route component selection here. **Published docs are the source of truth for syntax** — read the matching page before drafting JSX.

## Source of truth

- Index: [https://use.docs.page/components](https://use.docs.page/components)
- Before writing any MDX component, read its published page for syntax, child elements, and props
- Components are global — no imports required
- Do not invent component names or props; if unsure, read the index first

## Decision router

| Pattern | Component(s) | Published URL |
| --- | --- | --- |
| Sequential procedure | `<Steps>` / `<Step>` | [use.docs.page/components/steps](https://use.docs.page/components/steps) |
| Short how-to (≤5 steps) | Ordered list (plain Markdown) | — |
| Parallel options (OS, language, env) | `<Tabs>` / `<TabItem>` | [use.docs.page/components/tabs](https://use.docs.page/components/tabs) |
| Optional / FAQ detail | `<Accordion>` | [use.docs.page/components/accordion](https://use.docs.page/components/accordion) |
| API / config fields | `<Property>` | [use.docs.page/components/property](https://use.docs.page/components/property) |
| Notes, cautions, blockers | `<Info>`, `<Warning>`, `<Error>`, `<Success>` | [use.docs.page/components/callouts](https://use.docs.page/components/callouts) |
| Multi-snippet equivalents | `<CodeGroup>` | [use.docs.page/components/code-group](https://use.docs.page/components/code-group) |
| Highlighted code (single snippet) | Fenced code block | [use.docs.page/components/code-blocks](https://use.docs.page/components/code-blocks) |
| Section landing / related links | `<Card>` / `<CardGroup>` | [use.docs.page/components/card](https://use.docs.page/components/card) |
| Anchor link on heading | `<Heading>` | [use.docs.page/components/heading](https://use.docs.page/components/heading) |
| Repo images | `<Image>` | [use.docs.page/components/image](https://use.docs.page/components/image) |
| HTML5 video | `<Video>` | [use.docs.page/components/video](https://use.docs.page/components/video) |
| YouTube embed | `<YouTube>` | [use.docs.page/components/youtube](https://use.docs.page/components/youtube) |
| Vimeo embed | `<Vimeo>` | [use.docs.page/components/vimeo](https://use.docs.page/components/vimeo) |
| Twitter/X embed | `<Tweet>` | [use.docs.page/components/tweet](https://use.docs.page/components/tweet) |
| Font Awesome icon | `<Icon>` | [use.docs.page/components/icon](https://use.docs.page/components/icon) |

## Doc-type defaults

| Doc type | Preferred components |
| --- | --- |
| Tutorial | `<Steps>`, `<Info>` for prerequisites |
| How-To | `<Steps>` when steps are long; ordered lists when short; `<Warning>` for risky actions |
| Reference | `<Property>`, `<Accordion>` for nested groups, tables |
| Explanation | Prose; `<CardGroup>` for related links; mermaid only if user/project uses it |

## Hard rules

- No generic `<Callout>` — use `<Info>`, `<Warning>`, `<Error>`, or `<Success>` ([callouts reference](https://use.docs.page/components/callouts))
- No `<Cards>` — correct names are `<Card>` and `<CardGroup>`
- Respect Diátaxis limits in [style-lint.md](style-lint.md) (e.g. no `<Property>` in tutorials, no `<Steps>` in reference)

Do not duplicate syntax examples here — copy structure from the published page for each component you use.
