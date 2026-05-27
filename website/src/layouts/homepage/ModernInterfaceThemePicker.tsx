"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "~/lib/utils";

/** Scaled from Figma frame `2085664039` (~80%). */
const THEME_PICKER_MAX_WIDTH_PX = 540;
const THEME_PICKER_GAP_PX = 12;
const THEME_PRESET_BUTTON_HEIGHT_PX = 48;
const PRESET_PREVIEW_ASPECT = 1968 / 1254;

type ThemeSwatch = {
  background: string;
  bordered?: boolean;
};

type ThemePreset = {
  id: number;
  label: string;
  fontFamily: string;
  swatches: ThemeSwatch[];
  imagePath: string;
};

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 1,
    label: "Preset 01",
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    swatches: [
      { background: "#1C1816", bordered: true },
      { background: "#233CB5" },
      { background: "#F27500" },
    ],
    imagePath: "preset-1.png",
  },
  {
    id: 2,
    label: "Preset 02",
    fontFamily: '"Figtree", var(--font-sans), sans-serif',
    swatches: [
      { background: "#171B1D", bordered: true },
      { background: "#951F4C" },
      { background: "#3FB5D8" },
    ],
    imagePath: "preset-2.png",
  },
  {
    id: 3,
    label: "Preset 03",
    fontFamily: '"Roboto Slab", ui-serif, serif',
    swatches: [
      { background: "#1C161E", bordered: true },
      { background: "#E7E4E7" },
      { background: "#8FCC00" },
    ],
    imagePath: "preset-3.png",
  },
  {
    id: 4,
    label: "Preset 04",
    fontFamily: '"Outfit", var(--font-sans), sans-serif',
    swatches: [
      { background: "#1B1917", bordered: true },
      { background: "#8FCC00" },
      { background: "#E34B99" },
    ],
    imagePath: "preset-4.png",
  },
];

type ModernInterfaceThemePickerProps = {
  /** Maps a preset filename (e.g. `preset-4.png`) to a public URL with cache-busting. */
  imageSrc: (filename: string) => string;
};

/** Matches feature video frames (`FEATURE_VIDEO_CLASS` in `FeaturesSection.tsx`). */
const PRESET_MEDIA_BORDER_CLASS = "border border-neutral-700";

function ThemeSwatches({ swatches }: { swatches: ThemeSwatch[] }) {
  return (
    <div
      className="flex w-[30px] shrink-0 items-center justify-end gap-[3px]"
      aria-hidden
    >
      {swatches.map((swatch, index) => (
        <span
          key={index}
          className={cn(
            "box-border size-[9px] shrink-0 rounded-full",
            swatch.bordered && "border border-neutral-600",
          )}
          style={{ backgroundColor: swatch.background }}
        />
      ))}
    </div>
  );
}

export function ModernInterfaceThemePicker({
  imageSrc,
}: ModernInterfaceThemePickerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = THEME_PRESETS[activeIndex] ?? THEME_PRESETS[0];

  return (
    <section
      aria-label="Theme preset preview"
      className="mx-auto flex w-full max-w-[540px] flex-col items-center max-marketingNav:translate-x-0 marketingNav:mx-0 marketingNav:-translate-x-6 marketingNav:items-start"
      style={{ gap: THEME_PICKER_GAP_PX }}
    >
      <fieldset
        className="grid w-full shrink-0 grid-cols-4 border-0 p-0"
        style={{
          height: THEME_PRESET_BUTTON_HEIGHT_PX,
          gap: 8,
        }}
      >
        <legend className="sr-only">Theme presets</legend>
        {THEME_PRESETS.map((preset, index) => {
          const selected = activeIndex === index;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "flex min-w-0 items-center gap-1.5 overflow-hidden rounded-lg bg-black px-3.5 py-1 text-left transition-colors",
                PRESET_MEDIA_BORDER_CLASS,
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                selected && "bg-[#161616]",
              )}
              style={{ height: THEME_PRESET_BUTTON_HEIGHT_PX }}
            >
              <span className="flex min-w-0 flex-1 flex-col items-start overflow-hidden leading-none">
                <span className="font-sans text-[10px] leading-tight text-white/50">
                  Theme
                </span>
                <span
                  className="truncate text-[11px] font-medium leading-tight text-white"
                  style={{ fontFamily: preset.fontFamily }}
                >
                  {preset.label}
                </span>
              </span>
              <ThemeSwatches swatches={preset.swatches} />
            </button>
          );
        })}
      </fieldset>

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg",
          PRESET_MEDIA_BORDER_CLASS,
        )}
        style={{ aspectRatio: PRESET_PREVIEW_ASPECT }}
      >
        <Image
          key={active.id}
          src={imageSrc(active.imagePath)}
          alt={`Documentation preview with ${active.label} theme applied`}
          fill
          sizes={`(max-width: 768px) 90vw, ${THEME_PICKER_MAX_WIDTH_PX}px`}
          className="object-contain object-left-top"
          unoptimized={process.env.NODE_ENV === "development"}
        />
      </div>
    </section>
  );
}
