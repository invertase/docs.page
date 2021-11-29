import { useCallback, useContext, useEffect, useState } from 'react';
import { Environment, EnvironmentContext } from './utils/env';
import { ProjectConfig, ConfigContext, mergeConfig } from './utils/projectConfig';
import { PageContent, PageContentContext } from './utils/content';
import { CustomDomain, CustomDomainContext } from './utils/domain';
import { SlugProperties, SlugPropertiesContext } from './utils/properties';
import { DebugMode, DebugModeContext } from './utils/debug';
import {
  PreviewModeContext,
  PreviewMode,
  buildPreviewProps,
  PreviewPageProps,
  extractContents,
  FileSystemFileHandles,
  iterateDirectory,
} from './utils/preview';
import nProgress from 'nprogress';

export function usePreviewMode(): PreviewMode {
  return useContext(PreviewModeContext);
}

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

export function useHashChange(): string {
  const [hash, setHash] = useState('');

  function onHashChange() {
    // TODO: probably have to handle deeper index files, and redirects somewhere
    const newHash =
      window.location.hash.replace('#', '') === '/'
        ? '/index'
        : window.location.hash.replace('#', '');
    return setHash(newHash);
  }

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash;
}

export function useDirectorySelector(): {
  select: () => void;
  handles: FileSystemFileHandles;
  error: Error;
  pending: boolean;
  configHandle: FileSystemFileHandle;
} {
  const [error, setError] = useState<Error | null>(null);
  const [pending, setPending] = useState(false);
  const [handles, setHandles] = useState<FileSystemFileHandles | null>();
  const [configHandle, setConfigHandle] = useState<FileSystemFileHandle | null>();

  const select = useCallback(async () => {
    setPending(true);
    try {
      const handle = await window.showDirectoryPicker();
      let docs: FileSystemDirectoryHandle;
      // let foundDocsJson = false;
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && entry.name === 'docs.json') {
          setConfigHandle(entry);
          // foundDocsJson = true;
        }
        if (entry.kind === 'directory' && entry.name === 'docs') {
          docs = entry;
        }
      }

      if (!docs) {
        throw new Error('No docs directory found');
      }

      const docsHandles = await iterateDirectory(docs);

      setHandles(docsHandles);
    } catch (e) {
      setError(e);
    } finally {
      setPending(false);
    }
  }, []);

  return { select, handles, error, pending, configHandle };
}

export function usePollLocalDocs(
  handles: FileSystemFileHandles,
  configHandle: FileSystemFileHandle,
  ms = 500,
): PreviewPageProps | null {
  const hash = useHashChange();

  const [pageProps, setPageProps] = useState<PreviewPageProps | null>(null);

  useEffect(() => {
    nProgress.start();
  }, [hash]);

  useEffect(() => {
    if (!handles) {
      return;
    }

    const handle = handles[hash] || handles[`${hash}/index`];

    if (!handle) {
      console.log('handle not found, 404');
      buildPreviewProps({
        hash,
        config: JSON.stringify(mergeConfig({})),
        text: '',
        errorCode: 404,
      }).then(props => {
        setPageProps(props);
      });
      return;
    } else {
      const interval = setInterval(
        () =>
          extractContents(handle, configHandle)
            .then(([text, config]) => {
              const props = buildPreviewProps({
                hash,
                config,
                text,
              });
              return props;
            })
            .then(props => props && setPageProps(props))
            .catch(async () => {
              console.log('error in extract');
              const props = await buildPreviewProps({
                hash,
                config: JSON.stringify(mergeConfig({})),
                text: '',
                errorCode: 404,
              });
              setPageProps(props);
            }),
        ms,
      );

      return () => clearInterval(interval);
    }
  }, [handles, hash]);
  return pageProps;
}
