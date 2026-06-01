"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import preset1Image from "./assets/preset-1.png";
import preset2Image from "./assets/preset-2.png";
import preset3Image from "./assets/preset-3.png";
import preset4Image from "./assets/preset-4.png";
import styles from "./homepage.module.css";

const THEME_PICKER_GAP_PX = 12;
const THEME_PRESET_BUTTON_HEIGHT_PX = 48;
const PRESET_PREVIEW_ASPECT = 1968 / 1254;

/** Measured width below which label + swatches clip (px). */
const PRESET_BUTTON_SWATCH_ONLY_BELOW_PX = 112;
const PRESET_BUTTON_LABEL_RESTORE_ABOVE_PX = 118;

type ThemeSwatch = {
  background: string;
  bordered?: boolean;
};

type ThemePreset = {
  id: number;
  label: string;
  fontFamily: string;
  swatches: ThemeSwatch[];
  image: StaticImageData;
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
    image: preset1Image,
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
    image: preset2Image,
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
    image: preset3Image,
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
    image: preset4Image,
  },
];

const PRESET_MEDIA_BORDER_CLASS = "border border-neutral-700";

const PRESET_BUTTON_CLASS = cn(
  "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 overflow-hidden rounded-lg bg-black px-3.5 py-1 text-left transition-colors",
  PRESET_MEDIA_BORDER_CLASS,
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
);

function usePresetButtonSwatchOnly() {
  const ref = useRef<HTMLButtonElement>(null);
  const [swatchOnly, setSwatchOnly] = useState(false);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    const update = () => {
      const width = button.getBoundingClientRect().width;
      setSwatchOnly((prev) => {
        if (prev) return width < PRESET_BUTTON_LABEL_RESTORE_ABOVE_PX;
        return width < PRESET_BUTTON_SWATCH_ONLY_BELOW_PX;
      });
    };

    const observer = new ResizeObserver(update);
    observer.observe(button);
    update();

    return () => observer.disconnect();
  }, []);

  return { ref, swatchOnly };
}

function ThemeSwatches({ swatches }: { swatches: ThemeSwatch[] }) {
  return (
    <div
      className={cn(
        styles.themePresetBtnSwatches,
        "flex w-[30px] shrink-0 items-center justify-end gap-[3px]",
      )}
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

function ThemePresetButton({
  preset,
  selected,
  onSelect,
}: {
  preset: ThemePreset;
  selected: boolean;
  onSelect: () => void;
}) {
  const { ref, swatchOnly } = usePresetButtonSwatchOnly();

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      aria-label={`Theme ${preset.label}`}
      onClick={onSelect}
      className={cn(
        PRESET_BUTTON_CLASS,
        swatchOnly && styles.themePresetBtnCompact,
        selected && "bg-[#161616]",
      )}
      style={{ height: THEME_PRESET_BUTTON_HEIGHT_PX }}
    >
      <span
        className={cn(
          styles.themePresetBtnLabel,
          "flex min-w-0 flex-col items-start overflow-hidden leading-none",
        )}
      >
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
}

export function ModernInterfaceThemePicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = THEME_PRESETS[activeIndex] ?? THEME_PRESETS[0];

  return (
    <section
      aria-label="Theme preset preview"
      className="mx-auto flex w-full max-w-full flex-col items-start"
      style={{ gap: THEME_PICKER_GAP_PX }}
    >
      <fieldset
        className="grid w-full shrink-0 grid-cols-4 gap-2 border-0 p-0"
        style={{ height: THEME_PRESET_BUTTON_HEIGHT_PX }}
      >
        <legend className="sr-only">Theme presets</legend>
        {THEME_PRESETS.map((preset, index) => (
          <ThemePresetButton
            key={preset.id}
            preset={preset}
            selected={activeIndex === index}
            onSelect={() => setActiveIndex(index)}
          />
        ))}
      </fieldset>

      <div
        className={cn(
          "relative z-[1] w-full overflow-hidden rounded-lg",
          PRESET_MEDIA_BORDER_CLASS,
        )}
        style={{ aspectRatio: PRESET_PREVIEW_ASPECT }}
      >
        <Image
          key={active.id}
          src={active.image}
          alt={`Documentation preview with ${active.label} theme applied`}
          width={active.image.width}
          height={active.image.height}
          sizes="(max-width: 1023px) 90vw, 45vw"
          className="relative z-[1] h-full w-full object-contain object-left-top"
        />
      </div>
    </section>
  );
}
