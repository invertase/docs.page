/**
 * Top inset for the main article column and both doc sidebars so the three
 * columns align under the header. Used by `PageMetadata` and the first nav / TOC
 * `SidebarGroup` (overrides default `p-2` top from the sidebar component).
 */
export const docsContentTopPaddingClassName = "pt-7";

/**
 * Sticky `top` / max heights for docs chrome (left nav, “On this page”) so they
 * sit just below the **full** app header, not only the first row.
 *
 * Client-side, `components/docs-sticky-metrics.tsx` sets `--docs-header-h` to the
 * measured height of `#docs-app-header`, so this stays in sync if header or page
 * padding changes. Fallbacks mirror `header.tsx` when the variable is not set yet.
 */
export function docsStickyOffsetClassName(hasHeaderTabs: boolean) {
  return hasHeaderTabs
    ? "top-[var(--docs-header-h,calc(9.25rem+1px))]"
    : "top-[var(--docs-header-h,5.5rem)]";
}

/** Max height for the left nav column (viewport minus full header). */
export function docsNavMaxHeightClassName(hasHeaderTabs: boolean) {
  return hasHeaderTabs
    ? "h-[calc(100svh-var(--docs-header-h,calc(9.25rem+1px)))]"
    : "h-[calc(100svh-var(--docs-header-h,5.5rem))]";
}
