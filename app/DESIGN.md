# Design system

Source of truth for design tokens: [`src/styles/globals.css`](src/styles/globals.css).

## Primitive neutrals

Tailwind’s default `black` and `white` are overridden in `@theme inline`. Use these tokens (or the matching utilities) instead of `#000`, `#fff`, or raw palette steps when you mean the brand neutrals.

| Token | Hex | Usage |
| --- | --- | --- |
| `--color-black` | `#040406` | Dark surfaces, primary text on light UI, `bg-black`, `text-black` |
| `--color-white` | `#E7E8E9` | Light surfaces, primary text on dark UI, `bg-white`, `text-white` |

### CSS

```css
--color-black: #040406;
--color-white: #e7e8e9;
```

### Tailwind utilities

- `bg-black`, `text-black`, `border-black`, etc. → `#040406`
- `bg-white`, `text-white`, `border-white`, etc. → `#E7E8E9`
- Opacity modifiers (e.g. `bg-black/10`) mix from the same primitives.

### Semantic aliases

Light mode (`:root`) maps surface and ink tokens to the primitives where they previously used pure white or near-black:

- `--background`, `--card`, `--popover`, `--sidebar` → `var(--color-white)`
- `--foreground`, `--primary`, and related foreground tokens → `var(--color-black)` / `var(--color-white)` as appropriate

Dark mode (`.dark`) maps:

- `--background` → `var(--color-black)`
- `--foreground` and light-on-dark text → `var(--color-white)`
- Borders and inputs on dark UI use `color-mix` with `var(--color-white)` instead of `oklch(1 0 0 / …)`.

Prefer semantic tokens (`bg-background`, `text-foreground`) in components when theme-aware behaviour is needed. Use `bg-black` / `bg-white` only when you explicitly want the brand neutrals regardless of semantic role.

## Brand palettes

- **Periwinkle** — accent / cool highlights (`--color-periwinkle-*`)
- **Honey** — primary CTA on the homepage dark theme (`--color-honey-*`)

See `globals.css` for full scales.

## Typography

- **Heading** — `--font-heading` (loaded in `_app.tsx`)
- **Body / UI** — default sans stack
- **Mono** — `--font-mono` (JetBrains Mono, weight 300 via `@utility font-mono`)

## Conventions

- Do not hardcode `#040406` or `#E7E8E9` in components; use `--color-black`, `--color-white`, or semantic aliases.
- Project tokens override shadcn defaults; extend `globals.css` rather than patching components ad hoc.
- British English in comments; `color` (not `colour`) in token names.
