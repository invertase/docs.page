/**
 * Features — class names for shared marketing surfaces.
 *
 * Fills and chrome borders for light/dark live in `global.css` (`.marketing-surface-*`)
 * so dark mode is **only** zinc `rgb(39 39 42 / …)` — no `bg-yellow-*` + `dark:bg-zinc-*`
 * on the same node (avoids brown/yellow mixing).
 */
export const marketingPillBgClassName = "marketing-surface-bg";

export const marketingPillBorderAndBgClassName =
  "marketing-surface-pill-chrome";
