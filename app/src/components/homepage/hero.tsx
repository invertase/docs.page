import {
  RiArrowRightSLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";
import Link from "next/link";
import { Button, buttonTrailingIconClass } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";

import styles from "./homepage.module.css";

export function Hero() {
  return (
    <div>
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center space-y-10 pt-16 pb-36">
        <Eyebrow />
        <h1 className="flex flex-col items-center justify-center text-5xl md:text-6xl font-heading">
          <span className="font-light">Docs for</span>
          <span className="font-normal">humans + agents</span>
        </h1>
        <p className="text-center font-light text-neutral-400">
          Instantly <span className="text-primary">serve markdown</span> from
          any GitHub branch as modern, agent-ready docs, with AI chat, MCP, and
          llms.txt.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/get-started">
              <span>Get started</span>
              <RiArrowRightSLine
                data-icon="inline-end"
                className={buttonTrailingIconClass}
              />
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
    <div className={cn(styles.homepageEyebrow, "group/eyebrow cursor-pointer")}>
      <div
        className={cn(
          styles.homepageEyebrowInner,
          "px-4 py-2 text-base text-neutral-400/80 transition-colors group-hover/eyebrow:text-neutral-300",
        )}
      >
        Free and open-source
      </div>
    </div>
  );
}

function Terminal() {
  const command = "npx @docs.page/cli init";
  const { copied, copy } = useCopy(command);

  return (
    <div className="group/terminal border-primary border rounded-xl bg-periwinkle-950 px-4 py-2.5 flex items-center gap-2 font-mono">
      <span className="text-neutral-500">$</span>
      <span className="text-neutral-200/75 transition-colors group-hover/terminal:text-neutral-200">
        {command}
      </span>
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
