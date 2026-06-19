import { createContext, useContext } from "react";
import type { DocPageProps } from "../lib/types";

export const DocPageContext = createContext<DocPageProps | undefined>(
  undefined,
);

export function useDocPageContext() {
  const context = useContext(DocPageContext);
  if (!context) {
    throw new Error(
      "useDocPageContext must be used within a DocPageContext.Provider",
    );
  }
  return context;
}
