/**
 * Features — class names for shared marketing surfaces.
 *
 * Fills and chrome borders for light/dark live in `global.css` (`.marketing-surface-*`)
 * so dark mode is **only** neutral `rgb(31 41 55 / …)` — no `bg-periwinkle-*` + `dark:bg-neutral-*`
 * on the same node (avoids brown/yellow mixing).
 */
export const marketingPillBgClassName = "marketing-surface-bg";

export const marketingPillBorderAndBgClassName =
  "marketing-surface-pill-chrome";
