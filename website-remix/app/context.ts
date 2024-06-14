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

export const PageContext = createContext<Context | undefined>(undefined);

// Returns the current page context.
export function usePageContext(): Context {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error('usePageContext must be used within a PageContext.Provider');
  }

  return context;
}

// Returns the current locale.
//
// This is determined by the first segment of the path, e.g. `/fr/getting-started` would return `fr`.
// For it to be considered a valid locale, it must be included in the `locales` array of the bundle config,
// which is derived from the sidebar configuration.
export function useLocale(): string | undefined {
  const ctx = usePageContext();
  const locale = ctx.path.split('/').filter(Boolean).at(0);
  return locale && ctx.bundle.config.locales.includes(locale) ? locale : undefined;
}

export function useTabs() {
  const context = usePageContext();
  const locale = useLocale();
  const tabs = context.bundle.config.tabs;

  // If no locale is set, return tabs that are not locale-specific.
  if (!locale) {
    return tabs.filter(tab => !tab.locale);
  }

  // Otherwise, return tabs that match the current locale.
  return tabs.filter(tab => tab.locale === locale);
}
