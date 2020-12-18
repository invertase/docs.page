import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Config, ConfigContext } from './utils/config';
import { PageContent, PageContentContext } from './utils/content';
import { CustomDomain, CustomDomainContext } from './utils/domain';
import { SlugProperties, SlugPropertiesContext } from './utils/properties';

export function useCustomDomain(): CustomDomain {
  return useContext(CustomDomainContext);
}

export function useSlugProperties(): SlugProperties {
  return useContext(SlugPropertiesContext);
}

export function usePageContent(): PageContent {
  return useContext(PageContentContext);
}

export function useConfig(): Config {
  return useContext(ConfigContext);
}

export function useNoSSR() {
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => setReady(true), []);
  return ready;
}

// Returns a GitHub URL to edit the current page
export function useEditUrl(): string {
  const properties = useSlugProperties();
  const { type, baseBranch } = usePageContent();
  let ref = properties.ref;

  if (properties.isBaseBranch) {
    ref = baseBranch;
  }

  return `${properties.githubUrl}/edit/${ref}/docs/${properties.path}.${type}`;
}

export function useBodyScrollLock(lock: boolean): void {
  useEffect(() => {
    const el = window.document.body;
    if (lock) el.style.overflowY = 'hidden';
    if (!lock) el.style.overflowY = 'auto';
  }, [lock]);
}
