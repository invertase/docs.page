import { useCallback, useContext, useEffect, useState } from 'react';
import { Environment, EnvironmentContext } from './utils/env';
import { ProjectConfig, ConfigContext } from './utils/projectConfig';
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

export const cache = {
  text: '',
  config: '',
  props: null,
  urls: null,
};

export function usePollLocalDocs(
  handles: FileSystemFileHandles,
  configHandle: FileSystemFileHandle,
  ms = 500,
): [PreviewPageProps | null, number | null] {
  const [updating, setUpdating] = useState(0);
  const [pageProps, setPageProps] = useState(null);
  const hash = useHashChange();
  const [errorCode, setErrorCode] = useState<number | null>(null);
  useEffect(() => {
    if (!handles) return;
    const imageHandles = Object.keys(handles)
      .filter(key => ['.png', '.jpg', '.gif', '.jpeg'].some(ext => key.endsWith(ext)))
      .reduce((obj, key) => {
        obj[key] = handles[key];
        return obj;
      }, {});
    const handle = hash ? handles[hash] : handles[`${hash}/index`];
    const interval = setInterval(
      () =>
        extractContents(handle, configHandle, imageHandles)
          .then(([text, config, urls]) => {
            // console.log('extracting file');
            if (text !== cache.text || config !== cache.config || urls !== cache.urls) {
              // console.log('detected change');
              cache.urls = urls;
              cache.text = text;
              cache.config = config;
              setUpdating(updating + 1);
            }
          })
          .catch(e => {
            setErrorCode(404);
          }),
      ms,
    );
    return () => clearInterval(interval);
  }, [hash, handles, updating]);

  useEffect(() => {
    buildPreviewProps({ hash, config: cache.config, text: cache.text, urls: cache.urls }).then(
      previewProps => {
        setPageProps(previewProps);
      },
    );
  }, [cache.text, cache.config]);

  return [pageProps, errorCode];
}
