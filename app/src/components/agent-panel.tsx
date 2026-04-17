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
