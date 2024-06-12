import { createContext, useContext } from 'react';
import { BundlerOutput } from './api';

export type Context = {
  url: string;
  owner: string;
  repository: string;
  ref?: string;
  domain?: string;
  bundle: BundlerOutput;
};

export const PageContext = createContext<Context | undefined>(undefined);

export function usePageContext(): Context {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error('usePageContext must be used within a PageContext.Provider');
  }

  return context;
}
