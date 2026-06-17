import {
  RiArrowRightSLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";

export function Hero() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center space-y-6 px-2 pt-12 pb-32 sm:space-y-8 sm:px-0 sm:pt-16 sm:pb-44">
      <Eyebrow />
      <h1 className="flex flex-col items-center justify-center text-center font-heading text-4xl sm:text-5xl md:text-6xl">
        <span className="font-extralight">Docs for</span>
        <span>humans + agents</span>
      </h1>
      <p className="max-w-sm text-center text-sm font-light leading-relaxed text-neutral-400 sm:max-w-none sm:text-base">
        Instantly <span className="text-primary">serve markdown</span> from any
        GitHub branch as modern, agent-ready docs, with AI chat, MCP, and
        llms.txt.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:gap-4">
        <Button
          asChild
          size="lg"
          className="group rounded-full px-6 py-6 text-lg"
        >
          <Link href="/get-started">
            <span>Get started</span>
            <RiArrowRightSLine className="size-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Terminal />
      </div>
    </div>
  );
}

function Eyebrow() {
  return (
    <div className="border rounded-full px-4 py-2 bg-periwinkle-950 text-sm hover:cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
      Free and open-source
    </div>
  );
}

function Terminal() {
  const command = "npx @docs.page/cli init";
  const { copied, copy } = useCopy(command);

  return (
    <div className="group flex w-full items-center gap-2 rounded-xl border border-primary bg-periwinkle-950 px-3 py-2.5 sm:w-auto sm:px-4 sm:py-0">
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto opacity-75 transition-opacity group-hover:opacity-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="shrink-0 text-neutral-500">$</span>
        <span className="text-sm text-neutral-200 sm:text-base">{command}</span>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={copy}>
        {copied ? (
          <RiCheckLine className="text-green-500" />
        ) : (
          <RiFileCopyLine />
        )}
      </Button>
    </div>
  );
}
