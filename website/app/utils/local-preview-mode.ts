import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BundleSuccess } from '@docs.page/server';
import { DocumentationLoader } from '~/loaders/documentation.server';
import { mergeConfig } from './config';
export type PreviewMode = {
  enabled: boolean;
  onSelect: () => void;
  imageUrls: Record<string, string> | null;
};

export const PreviewModeContext = createContext<PreviewMode>({
  enabled: false,
  onSelect: () => {
    return;
  },
  imageUrls: {},
});

export function usePreviewMode(): PreviewMode {
  return useContext(PreviewModeContext);
}

export async function extractContents(
  handle: FileSystemFileHandle,
  configHandle: FileSystemFileHandle | null,
  imageHandles: FileSystemFileHandles,
): Promise<[string, string, Record<string, string>, Error[]]> {
  let config = mergeConfig({});
  let text = '';
  let imageUrls;

  const errors: Error[] = [];
  try {
    // get docs.json from config handle
    const configFile = await configHandle!.getFile();
    try {
      // build config from the file contents
      config = await mergeConfig(JSON.parse(await configFile!.text()));
    } catch (e) {
      console.error('Problems with docs.json format');
      // errors.push(e);
    }
  } catch (e) {
    console.error('Unable to getFile config');
    // errors.push(e);
  }
  try {
    const file = await handle.getFile();
    try {
      text = await file.text();
    } catch (e) {
      console.error('unable to extract text from file.');
      errors.push(e as Error);
    }
  } catch (e) {
    console.error('unable to getFile page');
    errors.push(e as Error);
  }
  try {
    imageUrls = Object.fromEntries(
      await Promise.all(
        Object.entries(imageHandles).map(async ([key, handle]) => {
          const url = URL.createObjectURL(await handle.getFile());
          return [key, url];
        }),
      ),
    );
  } catch (_) { }

  return [text, JSON.stringify(config), imageUrls, errors];
}

export type FileSystemFileHandles = { [path: string]: FileSystemFileHandle };

export async function iterateDirectory(
  directory: FileSystemDirectoryHandle,
  relativePath?: string,
  other?: FileSystemFileHandles,
): Promise<FileSystemFileHandles> {
  let handles: FileSystemFileHandles = {
    ...other,
  };

  for await (const entry of directory.values()) {
    if (entry.kind === 'file') {
      if (entry.name.endsWith('.mdx')) {
        handles[`${relativePath ?? ''}/${entry.name.replace('.mdx', '')}`] = entry;
      }
      if (['.png', '.gif', '.jpeg', '.jpg'].filter(ext => entry.name.endsWith(ext))) {
        handles[`${relativePath ?? ''}/${entry.name}`] = entry;
      }
    }

    if (entry.kind === 'directory') {
      handles = {
        ...handles,
        ...(await iterateDirectory(entry, `${relativePath ?? ''}/${entry.name}`, handles)),
      };
    }
  }

  return handles;
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
  handles: FileSystemFileHandles | null;
  error: Error | null;
  pending: boolean;
  configHandle: FileSystemFileHandle | null;
} {
  const [error, setError] = useState<Error | null>(null);
  const [pending, setPending] = useState(false);
  const [handles, setHandles] = useState<FileSystemFileHandles | null>(null);
  const [configHandle, setConfigHandle] = useState<FileSystemFileHandle | null>(null);

  const select = useCallback(async () => {
    setPending(true);
    try {
      const handle = (await window.showDirectoryPicker()) || null;

      let docs: FileSystemDirectoryHandle | null = null;
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
        setError(new Error('No docs directory found'));
      } else {
        const docsHandles = await iterateDirectory(docs);
        setHandles(docsHandles);
      }
    } catch (e) {
    } finally {
      setPending(false);
    }
  }, []);

  return { select, handles, error, pending, configHandle };
}

const cache = {
  text: '',
  config: {},
  props: null,
  urls: {},
};

export function usePollLocalDocs(
  handles: FileSystemFileHandles | null,
  configHandle: FileSystemFileHandle | null,
  ms = 500,
): [DocumentationLoader | null, Record<string, string>, number | null] {
  const [updating, setUpdating] = useState(0);
  const [pageProps, setPageProps] = useState<DocumentationLoader | null>(null);
  const hash = useHashChange();
  const [errorCode, setErrorCode] = useState<number | null>(null);

  useEffect(() => {
    if (!handles) {
      return;
    }

    // TODO: image handles once we've sorted out Link and Image Links etc
    const imageHandles = Object.keys(handles)
      .filter(key => ['.png', '.jpg', '.gif', '.jpeg'].some(ext => key.endsWith(ext)))
      .reduce((obj, key) => {
        //@ts-ignore
        obj[key] = handles[key];
        return obj;
      }, {});
    const handle = hash ? handles[hash] : handles[`/index.mdx`];

    const interval = setInterval(
      () =>
        extractContents(handle, configHandle, imageHandles)
          .then(([text, config, urls]) => {
            if (text !== cache.text || config !== cache.config || urls !== cache.urls) {
              cache.urls = urls;
              cache.text = text;
              cache.config = config;
              setUpdating(updating + 1);
            }
          })
          .catch(() => {
            setErrorCode(404);
          }),
      ms,
    );
    return () => clearInterval(interval);
  }, [hash, handles, updating]);

  useEffect(() => {
    console.log('%c File change detected, hot update! 🔥', 'color: #8b0000;');

    buildPreviewProps({ hash, config: cache.config, text: cache.text, urls: cache.urls }).then(
      previewProps => {
        setPageProps(previewProps);
      },
    ).then(() => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

  }, [cache.text, cache.config]);

  return [pageProps, cache.urls, errorCode];
}

//@ts-ignore
const buildPreviewProps = async (params: any): Promise<DocumentationLoader> => {
  let config = {};
  if (Object.keys(params.config).length > 0) {
    config = JSON.parse(params.config);
  }
  const md = params.text;

  let code: string | null = null;
  let frontmatter: BundleSuccess['frontmatter'] | null = null;
  let headings: BundleSuccess['headings'] | null = null;
  const body = {
    md,
    config,
    baseBranch: 'main',
  };

  if (md) {
    try {
      const host =
        //@ts-ignore
        window.ENV?.NODE_ENV === 'production' ? 'https://docs.page' : 'http://localhost:3001';
      const bundle = await fetch(`${host}/preview-fetch`, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'docs-page-preview': 'true',
        },
        body: JSON.stringify(body),
      }).then(r => r.json());

      code = bundle.code;
      frontmatter = bundle.frontmatter;
      headings = bundle.headings;
    } catch (e) {
      throw new Error('error bundling');
    }
  }

  return {
    owner: 'preview',
    repo: 'docs',
    path: '',
    ref: 'HEAD',
    baseBranch: 'main',
    source: { type: 'branch', owner: 'preview', repository: 'docs', ref: 'ref' },
    code: code || '',
    headings,
    config: mergeConfig(config),
    frontmatter: frontmatter || {},
  };
};
