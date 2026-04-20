import { useDocPageContext } from "@/hooks/use-doc-page-context";
import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";

type AgentPanelContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

export const AgentPanelContext = createContext<AgentPanelContextValue | null>(null);

export function AgentPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { hasAgent } = useDocPageContext();

  const toggle = useCallback(() => setOpen((previous) => !previous), []);

  useHotkeys(
    "mod+i",
    (event) => {
      event.preventDefault();
      toggle();
    },
    { enableOnFormTags: true, enabled: hasAgent },
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
