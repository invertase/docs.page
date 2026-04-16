import { createContext, useContext } from "react";
import type { DocPageProps } from "./types";

export const DocPageContext = createContext<DocPageProps>({} as DocPageProps);

export function useDocPageContext() {
  const context = useContext(DocPageContext);
  if (!context) {
    throw new Error("useDocPageContext must be used within a DocPageContext.Provider");
  }
  return context;
}