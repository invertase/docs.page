import { useContext, useEffect, useState } from 'react';
import { Environment, EnvironmentContext } from './utils/env';
import { ProjectConfig, ConfigContext } from './utils/projectConfig';
import { PageContent, PageContentContext } from './utils/content';
import { CustomDomain, CustomDomainContext } from './utils/domain';
import { SlugProperties, SlugPropertiesContext } from './utils/properties';
import { DebugMode, DebugModeContext } from './utils/debug';

export function useDebugMode(): DebugMode {
  return useContext(DebugModeContext);
}

export function useEnvironment(): Environment {
  return useContext(EnvironmentContext);
}

export function useCustomDomain(): CustomDomain {
  return useContext(CustomDomainContext);
}

export function useSlugProperties(): SlugProperties {
  return useContext(SlugPropertiesContext);
}

export function usePageContent(): PageContent {
  return useContext(PageContentContext);
}

export function useConfig(): ProjectConfig {
  return useContext(ConfigContext);
}

export function useToggle(defaultValue?: boolean): [boolean, () => void] {
  const [toggle, setToggle] = useState<boolean>(defaultValue);
  return [toggle, () => setToggle($ => !$)];
}

export function useNoSSR(): boolean {
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

export function hasScrolled(y = 0): boolean {
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
