import { createContext, useContext } from 'react';
import { BundlerOutput } from './api';

type BaseContext = {
  // The relative path of the current page, e.g. `/contributing`.
  path: string;
  // The bundle output for the current page.
  bundle: BundlerOutput;
};

type PreviewContext = BaseContext & {
  // The page is in preview mode.
  preview: true;
};

type PageContext = BaseContext & {
  // The owner of the repository, e.g. `invertase`.
  owner: string;
  // The repository name, e.g. `docs.page`.
  repository: string;
  // The branch or tag of the repository, e.g. `main`.
  ref?: string;
  // The domain assigned to the repository, e.g. `use.docs.page`.
  domain?: string;
  // The page is not in preview mode.
  preview: false;
};

export type Context = PageContext | PreviewContext;

export const PageContext = createContext<Context |  undefined>(undefined);

export function usePageContext(): Context {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error('usePageContext must be used within a PageContext.Provider');
  }

  return context;
}
