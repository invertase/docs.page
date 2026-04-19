"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import {
  PromptInputActionMenu,
  PromptInputFooter,
  PromptInputBody,
  PromptInputProvider,
  PromptInputTextarea,
  PromptInputActionMenuTrigger,
  PromptInput,
  PromptInputButton,
  PromptInputTools,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputSubmit,
} from "./ai-elements/prompt-input";
import {
  RiArrowRightBoxLine,
  RiArrowRightLine,
  RiArrowRightSFill,
  RiArrowRightSLine,
  RiChatAiLine,
  RiSendPlaneLine,
} from "@remixicon/react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type AgentPanelContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const AgentPanelContext = createContext<AgentPanelContextValue | null>(null);

export function AgentPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((previous) => !previous), []);

  useHotkeys(
    "mod+i",
    (event) => {
      event.preventDefault();
      toggle();
    },
    { enableOnFormTags: true },
  );

  const value = useMemo<AgentPanelContextValue>(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  );

  return (
    <AgentPanelContext.Provider value={value}>
      {children}
    </AgentPanelContext.Provider>
  );
}

export function useAgentPanel() {
  const context = useContext(AgentPanelContext);
  if (!context) {
    throw new Error("useAgentPanel must be used within an AgentPanelProvider");
  }
  return context;
}

export function AgentPanel() {
  const { open, setOpen } = useAgentPanel();
  const isMobile = useIsMobile(1200);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[75svh]! rounded-t-xl">
          <SheetTitle className="sr-only">Agent</SheetTitle>
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
          <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
            <div className="flex h-12 shrink-0 items-center px-4">
              <h2 className="flex-1 text-sm font-medium">Agent</h2>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <RiArrowRightSLine />
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Ask about this page, request edits, or summarize sections.
                </p>
                <p>Your conversation will appear here.</p>
              </div>
            </div>

            <div className="shrink-0 p-3">
              <div className="relative">
                <Textarea className="h-12 pr-14" />
                <Button className="absolute right-2 top-2">
                  <RiChatAiLine />
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </ResizablePanel>
    </>
  );
}
