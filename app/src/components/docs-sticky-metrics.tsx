"use client";

import { useLayoutEffect } from "react";

/**
 * Writes `--docs-header-h` (pixel height) from `#docs-app-header` so nav / TOC
 * `sticky` offsets and `scroll-margin` on headings match the real chrome when
 * header or page layout changes. Keeps `docs-layout.ts` fallbacks for first paint
 * and SSR.
 */
export function DocsStickyMetrics() {
  useLayoutEffect(() => {
    const el = document.getElementById("docs-app-header");
    if (!el) {
      return;
    }

    const setVar = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        "--docs-header-h",
        `${Math.round(h * 100) / 100}px`,
      );
      // Scroll-spy in `table-of-contents` listens to `resize`; the header
      // height can change without a window resize (e.g. tabs, font load).
      window.dispatchEvent(new Event("resize"));
    };

    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return null;
}
