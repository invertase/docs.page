"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { useAgentPanel } from "@/hooks/use-agent-panel";
import { AgentChat } from "@/components/agent/chat";

export function AgentPanel() {
  const { open, setOpen } = useAgentPanel();
  const isMobile = useIsMobile(1200);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[75svh]! rounded-t-xl">
          <SheetTitle className="sr-only">Agent</SheetTitle>
          <AgentChat />
        </SheetContent>
      </Sheet>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <>
      <ResizableHandle />
      <ResizablePanel
        id="docs-agent-panel"
        defaultSize={400}
        maxSize={600}
        minSize={300}
        className="overflow-visible!"
      >
        <aside
          aria-hidden={false}
          className={cn(
            "sticky top-0 h-svh w-full min-w-0 shrink-0 overflow-hidden border-l bg-background",
          )}
        >
          <AgentChat setOpen={setOpen} />
        </aside>
      </ResizablePanel>
    </>
  );
}
