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

export function useBodyScrollLock(lock: boolean): void {
  useEffect(() => {
    const el = window.document.body;
    if (lock) el.style.overflowY = 'hidden';
    if (!lock) el.style.overflowY = 'auto';
  }, [lock]);
}

export function hasScrolled(y: number = 0) {
  const [hasScrolled, setHasScrolled] = useState(false);

  // Toggle a scroll event function
  useEffect(() => {
    function onScroll() {
      setHasScrolled(window.scrollY > y);
    }

    window.addEventListener('scroll', onScroll);
    onScroll(); // Trigger on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, [y]);

  return hasScrolled;
}
