import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PAPER_SECTION_OVERLAP_CLASS,
  PAPER_SECTION_SHELL_CLASS,
  PaperClippedPanel,
} from "./paper-corner";

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
      corner="top-left"
      frosted={false}
      borderGradient
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
            className="font-light"
          >
            Documentation
          </Button>
          <Button
            variant={tab === "source" ? "outline" : "ghost"}
            onClick={() => setTab("source")}
            size="default"
            className="font-light"
          >
            Source Code
          </Button>
        </div>
        <div className="px-8 w-full">
          <div style={{ display: tab === "embedded" ? undefined : "none" }}>
            <Embedded />
          </div>
          {tab === "source" && client && <PreviewSource />}
        </div>
      </div>
      <div className="py-12">
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
    <div className="h-[800px] bg-black rounded-3xl overflow-hidden border">
      <iframe
        title="docs.page"
        src="https://use.docs.page/~ai"
        className="w-full h-full"
      />
    </div>
  );
}
