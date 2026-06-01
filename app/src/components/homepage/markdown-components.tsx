import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  PAPER_SECTION_OVERLAP_CLASS,
  PAPER_SECTION_SHELL_CLASS,
  PaperCorner,
  PaperSectionSideRails,
  paperCornerClipPath,
} from "./paper-corner";

export function MarkdownComponents() {
  return (
    <div
      className={cn(
        PAPER_SECTION_SHELL_CLASS,
        PAPER_SECTION_OVERLAP_CLASS,
        "bg-neutral-950 pb-40",
      )}
      style={{ clipPath: paperCornerClipPath("top-left") }}
    >
      <PaperCorner corner="top-left" />
      <PaperSectionSideRails />
      <div className="mx-auto flex flex-col max-w-8xl space-y-8">
        <div className="pl-26 pt-8">
          <h3 className="text-sm uppercase text-neutral-400">
            <span className="text-primary">Markdown</span> Components
          </h3>
        </div>
        <div className="grid grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-4 mt-12 px-20 space-y-6">
            <h4 className="text-3xl font-light font-heading text-neutral-300">
              Markdown components
            </h4>
            <p className="text-neutral-400">
              Add interactive components to your docs with MDX for richer
              experiences than standard Markdown.
            </p>
            <div>
              <Button variant="default" asChild size="lg">
                <Link href="/agent-access">
                  <span>Learn more</span>
                  <RiArrowRightSLine className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
