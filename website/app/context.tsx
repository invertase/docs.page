import React, { createContext } from 'react';
import { DocumentationLoader } from './loaders/documentation.server';

const DocumentationContext = createContext<DocumentationLoader>({} as DocumentationLoader);

export type DocumentationProviderProps = {
  data: DocumentationLoader;
  children: React.ReactNode | React.ReactNode[];
};

export function DocumentationProvider({ data, children }: DocumentationProviderProps) {
  return <DocumentationContext.Provider value={data}>{children}</DocumentationContext.Provider>;
}

export function useDocumentationContext() {
  return React.useContext(DocumentationContext);
}

export function useRepositoryUrl(): string {
  const { owner, repo, ref } = React.useContext(DocumentationContext);

  return `https://github.com/${owner}/${repo}/tree/${ref}`;
}
