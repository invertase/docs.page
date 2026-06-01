import { useDocPageContext } from "@/hooks/use-doc-page-context";
import {
  getAgentPanelCookieName,
  getAgentPanelCookiePath,
} from "@/lib/agent-panel-state";
import Cookies from "js-cookie";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";

type AgentPanelContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
};

export const AgentPanelContext = createContext<AgentPanelContextValue | null>(
  null,
);

export function AgentPanelProvider({ children }: { children: ReactNode }) {
  const { meta, bundle, route } = useDocPageContext();
  const [open, setOpenState] = useState(
    () => meta.hasAgent && meta.initialAgentPanelOpen,
  );
  const cookieName = useMemo(
    () =>
      getAgentPanelCookieName(bundle.source.owner, bundle.source.repository),
    [bundle.source.owner, bundle.source.repository],
  );
  const cookiePath = useMemo(() => getAgentPanelCookiePath(route), [route]);

  const setOpen = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value) => {
      setOpenState((previous) => {
        const nextOpen = typeof value === "function" ? value(previous) : value;
        Cookies.set(cookieName, nextOpen ? "1" : "0", {
          expires: 365,
          path: cookiePath,
          sameSite: "lax",
        });
        return nextOpen;
      });
    },
    [cookieName, cookiePath],
  );

  useLayoutEffect(() => {
    setOpenState(meta.hasAgent && meta.initialAgentPanelOpen);
  }, [meta.hasAgent, meta.initialAgentPanelOpen]);

  const toggle = useCallback(() => {
    setOpen((previous) => !previous);
  }, [setOpen]);

  useHotkeys(
    "mod+i",
    (event) => {
      event.preventDefault();
      toggle();
    },
    { enableOnFormTags: true, enabled: meta.hasAgent },
  );

  const value = useMemo<AgentPanelContextValue>(
    () => ({ open, setOpen, toggle }),
    [open, setOpen, toggle],
  );

  return (
    <AgentPanelContext.Provider value={value}>
      {children}
    </AgentPanelContext.Provider>
  );
}
