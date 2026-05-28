import Link from "next/link";
import { RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { useCopy } from "@/hooks/use-copy";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="border-x">
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center pt-16 pb-32 space-y-8">
        <Eyebrow />
        <h1 className="flex flex-col items-center justify-center text-5xl md:text-6xl font-heading">
          <span className="font-extralight">Docs for</span>
          <span>humans + agents</span>
        </h1>
        <p className="text-center font-light text-neutral-400">
          Instantly <span className="text-primary">serve markdown</span> from any GitHub branch as modern, agent-ready
          docs, with AI chat, MCP, and llms.txt.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg" className="px-6 py-6 text-lg">
            <Link href="/get-started">
              <span>Get started</span>
              <RiArrowRightSLine className="size-6" />
            </Link>
          </Button>
          <Terminal />
        </div>
      </div>
    </div>
  );
}

function Eyebrow() {
  return (
    <div className="border rounded-full px-4 py-2 bg-periwinkle-50/10 text-sm hover:cursor-pointer">
      Free and open-source
    </div>
  );
}

function Terminal() {
  const command = "npx @docs.page/cli init";
  const { copied, copy } = useCopy(command);

  return (
    <div className="border-primary border rounded-md bg-periwinkle-950 px-4 py-3 flex items-center gap-2">
      <span className="text-neutral-500">$</span>
      <span className="text-neutral-200">{command}</span>
      <Button variant="ghost" size="icon-sm" onClick={copy}>
        {copied ? <RiCheckLine className="text-green-500" /> : <RiFileCopyLine />}
      </Button>
    </div>
  );
}
