import { cn } from "@/lib/utils";
import { RiArrowRightSLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  PAPER_SECTION_OVERLAP_CLASS,
  PAPER_SECTION_SHELL_CLASS,
  PaperCorner,
  PaperSectionSideRails,
  paperCornerClipPath,
} from "./paper-corner";

import gif from "./assets/agent-ready.gif";

export function AgentAccess() {
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
            <span className="text-primary">Agent</span> Access
          </h3>
        </div>
        <div className="grid grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-4 mt-12 px-20 space-y-6">
            <h4 className="text-3xl font-light font-heading text-neutral-300">
              Agent access
            </h4>
            <p className="text-neutral-400">
              Let users' AI agents query your documentation. Built-in MCP
              servers alongside llms.txt files allow LLMs to ingest your product
              context instantly.
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
          <div className="relative px-20">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle at center, color-mix(in srgb, var(--color-periwinkle-400) 45%, transparent), color-mix(in srgb, var(--color-periwinkle-500) 24%, transparent) 40%, color-mix(in srgb, var(--color-periwinkle-500) 8%, transparent) 58%, transparent 75%)",
              }}
              aria-hidden
            />
            <Image
              src={gif}
              alt="Agent ready"
              className="relative z-1 w-full h-full rounded-md object-cover border border-border/50 shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
