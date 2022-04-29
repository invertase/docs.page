import React, { createContext } from 'react';
import { DocumentationLoader } from './loaders/documentation.server';
import { ensureLeadingSlash } from './utils';
import { usePreviewMode } from './utils/preview';

const DocumentationContext = createContext<DocumentationLoader>({} as DocumentationLoader);

export type DomainProviderProps = {
  data: {
    domain: string | null;
  };
  children: React.ReactNode | React.ReactNode[];
};

const DomainContext = createContext<{ domain: string | null }>({} as { domain: string | null });

export function DomainProvider({ data, children }: DomainProviderProps) {
  return <DomainContext.Provider value={data}>{children}</DomainContext.Provider>;
}

export function useCustomDomain() {
  return React.useContext(DomainContext);
}

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
  const { domain } = useCustomDomain();

  const { ref } = React.useContext(DocumentationContext);

  let url = '/';

  if (ref && !domain) {
    url += `${ref === 'HEAD' ? '' : `~${encodeURIComponent(ref)}`}`;
  }

  return url;
}

export function useRepositoryUrl(): string {
  const { owner, repo, ref } = React.useContext(DocumentationContext);

  return `https://github.com/${owner}/${repo}/tree/${encodeURIComponent(ref)}`;
}

export function useImagePath(src: string) {
  if (src.startsWith('http')) {
    return src;
  }

  const previewMode = usePreviewMode();

  if (previewMode?.enabled && previewMode.imageUrls) {
    return previewMode?.imageUrls[src] || '';
  }

  const blob = useRawBlob(src);
  return blob;
}

// Returns a path to a blob in the `docs` directory.
export function useRawBlob(path: string): string {
  const { source, baseBranch } = React.useContext(DocumentationContext);
  const { owner, repository: repo, ref } = source;

  if (source.type === 'branch') {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(
      ref ?? baseBranch,
    )}/docs${ensureLeadingSlash(path)}`;
  }
  if (source.type === 'PR') {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(
      ref ?? baseBranch,
    )}/docs${ensureLeadingSlash(path)}`;
  }

  return `https://raw.githubusercontent.com/${owner}/${repo}/main/docs${ensureLeadingSlash(path)}`;
}
