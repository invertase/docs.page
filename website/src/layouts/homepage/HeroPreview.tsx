"use client";

import Image from "next/image";
import { useCallback, useId, useRef, useState } from "react";

import { landingAssetPath } from "~/constants/assets";
import { cn } from "~/lib/utils";

/** PNGs are exported at 3× — these are the 1× layout dimensions. */
const HERO_PREVIEW_TABS = [
  {
    id: "documentation",
    label: "Documentation",
    src: landingAssetPath("hero-documentation.png"),
    width: 1269,
    height: 744,
  },
  {
    id: "sourcecode",
    label: "Source code",
    src: landingAssetPath("hero-sourcecode.png"),
    width: 1252,
    height: 744,
  },
] as const;

type HeroPreviewTabId = (typeof HERO_PREVIEW_TABS)[number]["id"];

export function HeroPreview() {
  const baseId = useId();
  const [activeTab, setActiveTab] = useState<HeroPreviewTabId>("documentation");
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback((id: HeroPreviewTabId) => {
    const container = containerRef.current;
    if (!container) return;
    const btn = container.querySelector<HTMLElement>(`[data-tab-id="${id}"]`);
    if (!btn) return;
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, []);

  const handleTabClick = (id: HeroPreviewTabId) => {
    setActiveTab(id);
    updateIndicator(id);
  };

  const containerRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
      if (node) {
        requestAnimationFrame(() => updateIndicator(activeTab));
      }
    },
    [activeTab, updateIndicator],
  );
  const active =
    HERO_PREVIEW_TABS.find((tab) => tab.id === activeTab) ??
    HERO_PREVIEW_TABS[0];

  return (
    <section
      aria-label="docs.page preview"
      className="hero-preview-unit mx-auto flex w-full min-w-0 max-w-6xl flex-col items-stretch gap-3 sm:gap-4"
    >
      <div
        role="tablist"
        aria-label="Preview mode"
        className="flex justify-center"
      >
        <div
          ref={containerRefCallback}
          className="relative flex w-fit gap-1 rounded-lg border border-border bg-black/70 p-1"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-1 z-0 rounded-md border border-border bg-periwinkle-500/[0.18] transition-[left,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] dark:bg-periwinkle-400/[0.18]"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {HERO_PREVIEW_TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                data-tab-id={tab.id}
                id={`${baseId}-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "relative z-10 whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-sm font-medium transition-colors duration-200 sm:px-4 sm:py-1.5 sm:text-base",
                  selected
                    ? "text-honey-500"
                    : "text-neutral-500 hover:text-foreground dark:text-neutral-400 dark:hover:text-neutral-200",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${active.id}`}
        className="w-full min-w-0"
      >
        <Image
          key={active.id}
          src={active.src}
          alt=""
          width={active.width}
          height={active.height}
          className="h-auto w-full"
          sizes="(max-width: 1280px) 100vw, 1152px"
          priority
        />
      </div>
    </section>
  );
}
