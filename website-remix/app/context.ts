import { createContext, useContext } from 'react';

export type Context = {
  url: URL;
  owner: string;
  repository: string;
  ref?: string;
  domain?: string;
  bundle: any;
};

export const PageContext = createContext<Context | undefined>(undefined);

export function usePageContext(): Context {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error('usePageContext must be used within a PageContext.Provider');
  }

  return context;
}
