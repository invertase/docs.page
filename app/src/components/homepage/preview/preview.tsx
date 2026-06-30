import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PAPER_SECTION_OVERLAP_CLASS,
  PAPER_SECTION_SHELL_CLASS,
  PaperClippedPanel,
} from "../paper-corner";

const PreviewEmbedded = dynamic(
  () =>
    import("./preview-embedded").then((mod) => ({
      default: mod.PreviewEmbedded,
    })),
  { ssr: false },
);

const PreviewSource = dynamic(
  () =>
    import("./preview-source").then((mod) => ({ default: mod.PreviewSource })),
  { ssr: false },
);

export function Preview() {
  const [tab, setTab] = useState<"embedded" | "source">("embedded");
  const [client, setClient] = useState<boolean>(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <PaperClippedPanel
      frosted={false}
      className={cn(
        PAPER_SECTION_SHELL_CLASS,
        PAPER_SECTION_OVERLAP_CLASS,
        "pb-32",
      )}
    >
      <div className="mx-auto flex max-w-8xl flex-col items-center justify-center py-16 space-y-5">
        <div className="flex items-center gap-2 rounded-full border bg-periwinkle-950 p-2">
          <Button
            variant={tab === "embedded" ? "outline" : "ghost"}
            onClick={() => setTab("embedded")}
            size="default"
            className={cn(
              "rounded-full font-light",
              tab === "embedded" &&
                "border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary aria-expanded:bg-primary/10 aria-expanded:text-primary dark:border-primary dark:bg-transparent dark:hover:bg-primary/10",
            )}
          >
            Documentation
          </Button>
          <Button
            variant={tab === "source" ? "outline" : "ghost"}
            onClick={() => setTab("source")}
            size="default"
            className={cn(
              "rounded-full font-light",
              tab === "source" &&
                "border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary aria-expanded:bg-primary/10 aria-expanded:text-primary dark:border-primary dark:bg-transparent dark:hover:bg-primary/10",
            )}
          >
            Source Code
          </Button>
        </div>
        <div className="w-full px-2 sm:px-8">
          <div style={{ display: tab === "embedded" ? undefined : "none" }}>
            <Embedded />
          </div>
          {tab === "source" && client && <PreviewSource />}
        </div>
      </div>
      <div className="py-12 px-6 sm:px-8">
        <h2 className="text-center text-3xl font-light font-heading text-neutral-300">
          Trusted by more than 75,000{" "}
          <span className="text-primary">open-source</span> developers
        </h2>
      </div>
    </PaperClippedPanel>
  );
}

function Embedded() {
  return (
    <div className="h-[min(680px,75dvh)] overflow-hidden rounded-2xl border bg-black sm:h-[800px] sm:rounded-xl">
      <PreviewEmbedded />
    </div>
  );
}
