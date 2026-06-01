import { AgentPanelContext } from "@/components/agent/provider";
import { useContext } from "react";

export function useAgentPanel() {
  const context = useContext(AgentPanelContext);

  if (!context) {
    throw new Error("useAgentPanel must be used within an AgentPanelProvider");
  }

  return context;
}
