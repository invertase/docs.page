"use client";

import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";

export function useAgentPanel() {
  const [open, setOpen] = useState(false);

  useHotkeys(
    "mod+i",
    (event) => {
      event.preventDefault();
      setOpen((previous) => !previous);
    },
    { enableOnFormTags: true },
  );

  return { open, setOpen };
}

export function AgentPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isMobile = useIsMobile(1200);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[75svh]! rounded-t-xl"
        >
          <SheetTitle className="sr-only">Agent</SheetTitle>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      aria-hidden={!open}
      className={cn(
        "sticky top-0 h-svh shrink-0 overflow-hidden transition-[width] duration-200 ease-out border-l",
        open ? "w-88" : "w-0",
      )}
    >
      <div className="h-full w-80" />
    </aside>
  );
}
