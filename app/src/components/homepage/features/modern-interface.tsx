import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import hexagon from "../assets/hexagon-bg.svg";
import preset1Image from "../assets/preset-1.png";
import preset2Image from "../assets/preset-2.png";
import preset3Image from "../assets/preset-3.png";
import preset4Image from "../assets/preset-4.png";

const THEME_PRESETS = [
  {
    id: "b6TqMNb5Wb",
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
    id: "k9PmR2xLq4",
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
    id: "n3VwH8cYt1",
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
    id: "p7ZsQ4dUa2",
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
  const preset = THEME_PRESETS[activePreset];

  return (
    <div className="relative isolate min-h-64">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-periwinkle-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-4 -bottom-6 size-44 bg-contain bg-center bg-no-repeat opacity-25"
        style={{ backgroundImage: `url(${hexagon.src})` }}
        aria-hidden
      />

      <ConfigPane presetId={preset.id} fontFamily={preset.fontFamily} />

      <div className="relative z-1 ml-auto w-full sm:w-[74%]">
        <div className="overflow-hidden rounded-lg border border-border/60 bg-black shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)] ring-1 ring-white/5">
          <Image
            src={preset.image}
            alt={preset.label}
            className="h-full w-full object-cover motion-safe:transition-opacity motion-safe:duration-300"
          />
        </div>
      </div>

      <PresetMenu
        presetId={preset.id}
        onShuffle={() =>
          setActivePreset((index) => (index + 1) % THEME_PRESETS.length)
        }
      />

      <div
        className="absolute bottom-1 left-1/2 z-2 flex -translate-x-1/2"
        aria-hidden
      >
        {preset.swatches.map((swatch, index) => (
          <span
            key={swatch.background}
            className={cn(
              "size-7 rounded-full shadow-md ring-2 ring-black/50",
              index > 0 && "-ml-2.5",
              "bordered" in swatch && "ring-white/20",
            )}
            style={{
              background: swatch.background,
              zIndex: preset.swatches.length - index,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ConfigPane({
  presetId,
  fontFamily,
}: {
  presetId: string;
  fontFamily: string;
}) {
  return (
    <div
      aria-hidden
      className="absolute top-[12%] left-0 z-0 hidden w-[58%] sm:block"
    >
      <div
        className="rounded-lg border border-border/50 bg-neutral-950/80 font-mono text-[10px] leading-5 shadow-2xl backdrop-blur-sm"
        style={{ fontFamily }}
      >
        <div className="border-b border-border/40 px-3 py-1 text-neutral-500">
          docs.json
        </div>
        <div className="overflow-hidden px-3 py-2 text-neutral-400">
          <div>{"{"}</div>
          <div>
            {"  "}
            <span className="text-neutral-500">"$schema"</span>:
            "https://docs.page/schema.json",
          </div>
          <div>
            {"  "}
            <span className="text-neutral-500">"name"</span>: "Acme Cloud",
          </div>
          <div>
            {"  "}
            <span className="text-neutral-500">"theme"</span>: {"{"}
          </div>
          <div className="-mx-1 my-0.5 rounded-sm bg-periwinkle-500/20 px-1 ring-1 ring-periwinkle-500/60">
            {"    "}
            <span className="text-periwinkle-300">"preset"</span>:{" "}
            <span className="text-honey-400">"{presetId}"</span>
          </div>
          <div>
            {"  "}
            {"}"}
          </div>
          <div>{"}"}</div>
        </div>
      </div>
    </div>
  );
}

function PresetMenu({
  presetId,
  onShuffle,
}: {
  presetId: string;
  onShuffle: () => void;
}) {
  return (
    <div className="absolute top-[22%] left-2 z-2 w-40 sm:left-[10%] sm:w-44">
      <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-md">
        <div className="truncate rounded-md bg-neutral-900 px-2 py-1.5 font-mono text-[11px] text-neutral-200">
          --preset {presetId}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center font-light"
          asChild
        >
          <Link href="/modern-interface">Open Preset</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center font-light"
          onClick={onShuffle}
        >
          Shuffle
        </Button>
      </div>
    </div>
  );
}
