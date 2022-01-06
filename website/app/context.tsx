import React, { createContext } from 'react';
import { DocumentationLoader } from './loaders/documentation.server';
import { ensureLeadingSlash } from './utils';

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

export function useBaseUrl(): string {
  const { owner, repo, ref } = React.useContext(DocumentationContext);
  let url = `/${owner}/${repo}`;

  if (ref) {
    url += `~${ref}`;
  }

  return url;
}

export function useRepositoryUrl(): string {
  const { owner, repo, ref } = React.useContext(DocumentationContext);

  return `https://github.com/${owner}/${repo}/tree/${ref}`;
}

export function useImagePath(src: string) {
  const blob = useRawBlob(src);

  if (src.startsWith('http')) {
    return src;
  }

  return blob;
}

// Returns a path to a blob in the `docs` directory.
export function useRawBlob(path: string): string {
  const context = React.useContext(DocumentationContext);
  const { source, baseBranch } = context
  const { owner, repository: repo, ref } = source;
  if (source.type === 'branch') {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref ?? baseBranch}/docs${ensureLeadingSlash(
      path,
    )}`;
  }
  if (source.type === 'PR') {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref ?? baseBranch}/docs${ensureLeadingSlash(
      path,
    )}`;
  }



  return `https://raw.githubusercontent.com/${owner}/${repo}/main/docs${ensureLeadingSlash(
    path,
  )}`;
}
