import Image from "next/image";
import { cn } from "@/lib/utils";
import preset1Image from "../assets/preset-1.png";
import preset2Image from "../assets/preset-2.png";
import preset3Image from "../assets/preset-3.png";
import preset4Image from "../assets/preset-4.png";
import { useState } from "react";

const THEME_PRESETS = [
  {
    label: "Preset 01",
    image: preset1Image,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    swatches: [
      { background: "#1C1816", bordered: true },
      { background: "#233CB5" },
      { background: "#F27500" },
    ],
  },
  {
    label: "Preset 02",
    image: preset2Image,
    fontFamily: '"Figtree", var(--font-sans), sans-serif',
    swatches: [
      { background: "#171B1D", bordered: true },
      { background: "#951F4C" },
      { background: "#3FB5D8" },
    ],
  },
  {
    label: "Preset 03",
    image: preset3Image,
    fontFamily: '"Roboto Slab", ui-serif, serif',
    swatches: [
      { background: "#1C161E", bordered: true },
      { background: "#E7E4E7" },
      { background: "#8FCC00" },
    ],
  },
  {
    label: "Preset 04",
    image: preset4Image,
    fontFamily: '"Outfit", var(--font-sans), sans-serif',
    swatches: [
      { background: "#1B1917", bordered: true },
      { background: "#8FCC00" },
      { background: "#E34B99" },
    ],
  },
] as const;

export function ModernInterface() {
  const [activePreset, setActivePreset] = useState(0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {THEME_PRESETS.map((preset, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActivePreset(i)}
            className={cn("flex items-center justify-center gap-3 border h-12 rounded-lg", activePreset === i && "bg-muted/50")}
          >
            <div className="hidden lg:block">
              <span className="text-[10px] font-medium">{preset.label}</span>
            </div>
            <div className="flex justify-end gap-1">
              {preset.swatches.map((swatch, j) => (
                <div
                  key={j}
                  className={cn("size-2 rounded-full", 'bordered' in swatch && "border")}
                  style={{ background: swatch.background }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Image
          src={THEME_PRESETS[activePreset].image}
          alt={THEME_PRESETS[activePreset].label}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
