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
import googleAnalytics from './scripts/google-analytics';
import { isProduction } from './utils';

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
  const fileType = usePageContent().type;
  return `${properties.githubUrl}/edit/${properties.ref}/docs/${properties.path}.${fileType}`;
}

export function useBodyScrollLock(lock: boolean): void {
  useEffect(() => {
    const el = window.document.body;
    if (lock) el.style.overflowY = 'hidden';
    if (!lock) el.style.overflowY = 'auto';
  }, [lock]);
}

export function useLocalStorageToggle(
  key: string,
): [MutableRefObject<HTMLDivElement>, () => void, boolean] {
  const ref = useRef<HTMLDivElement>();
  const [visible, setVisible] = useState<boolean>();

  const onToggle = useCallback(() => {
    const el = ref.current;
    el.classList.toggle('hidden');
    const isVisible = !el.classList.contains('hidden');
    window.localStorage.setItem(`docs.page.${key}`, isVisible ? 'true' : 'false');
    setVisible(isVisible);
  }, [key]);

  return [ref, onToggle, visible];
}

