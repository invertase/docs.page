import { useCallback, useEffect, useState } from 'react';
import { BundleSuccess } from '@docs.page/server';
import { DocumentationLoader } from '~/loaders/documentation.server';
import { mergeConfig } from './config';
import * as path from 'path';
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

interface DirectorySelector {
  select: () => void;
  handles: FileSystemFileHandles | null;
  error: Error | null;
  pending: boolean;
  configHandle: FileSystemFileHandle | null;
  refsConfigHandle: FileSystemFileHandle | null;
}

export function useDirectorySelector(): DirectorySelector {
  const [error, setError] = useState<Error | null>(null);
  const [pending, setPending] = useState(false);
  const [handles, setHandles] = useState<FileSystemFileHandles | null>(null);
  const [configHandle, setConfigHandle] = useState<FileSystemFileHandle | null>(null);
  const [refsConfigHandle, setRefsConfigHandle] = useState<FileSystemFileHandle | null>(null);
  const select = useCallback(async () => {
    setPending(true);
    try {
      const handle = (await window.showDirectoryPicker()) || null;

      let docs: FileSystemDirectoryHandle | null = null;
      let foundConfig = false;
      let foundRefsConfig = false;
      for await (const entry of handle.values()) {
        if (
          !foundConfig &&
          entry.kind === 'file' &&
          ['docs.json', 'docs.yaml', 'docs.toml'].includes(entry.name)
        ) {
          setConfigHandle(entry);
          foundConfig = true;
        }
        if (!foundRefsConfig && entry.kind === 'file' && entry.name === 'docs.refs.json') {
          setRefsConfigHandle(entry);
          foundRefsConfig = true;
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

  return { select, handles, error, pending, configHandle, refsConfigHandle };
}

type PreviewCache = {
  text?: string;
  config?: Configs;
  refsConfig?: { name: string; path: string; kind: string }[] | null;
  props?: string;
  urls?: Record<string, string>;
};
const cache: PreviewCache = {};

interface PolledLocalDocs {
  documentationLoader: DocumentationLoader | null;
  urls?: Record<string, string>;
  errorCode: number | null;
}

export function usePollLocalDocs(
  handles: FileSystemFileHandles | null,
  configHandle: FileSystemFileHandle | null,
  refsConfigHandle: FileSystemFileHandle | null,
  ms = 500,
): PolledLocalDocs {
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

    const indexHash = hash ? path.join(hash, 'index.mdx') : '/index.mdx';
    const handle = handles[hash] || handles[indexHash];

    if (!handle) {
      throw new Error('cant get handle');
    }

    const interval = setInterval(
      () =>
        extractContents(handle, configHandle, imageHandles, refsConfigHandle)
          .then(([text, config, urls, refsConfig]) => {
            if (text !== cache.text || urls !== cache.urls || refsConfig != cache.refsConfig) {
              cache.urls = urls;
              cache.text = text;
              cache.config = config;
              cache.refsConfig = refsConfig;
            }
            setUpdating(updating + 1);
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
    buildPreviewProps({
      hash,
      config: cache.config,
      text: cache.text || '',
      urls: cache.urls || {},
      refsConfig: cache.refsConfig || null,
    })
      .then(setPageProps)
      .then(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
  }, [cache.text, cache.config, cache.urls]);

  return { documentationLoader: pageProps, urls: cache.urls, errorCode };
}

type PreviewParams = {
  hash: string;
  config?: Configs;
  text: string;
  urls: Record<string, string>;
  refsConfig: { name: string; path: string; kind: string }[] | null;
};

const buildPreviewProps = async (params: PreviewParams): Promise<DocumentationLoader> => {
  const md = params.text;

  let code: string | null = null;
  let frontmatter: BundleSuccess['frontmatter'] | null = null;
  let headings: BundleSuccess['headings'] | null = null;
  let config: Record<string, unknown> | null = null;
  const body = {
    md,
    config: params.config,
    baseBranch: 'main',
  };

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
    config = bundle.config;
  } catch (e) {
    throw new Error('error bundling');
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
    config: mergeConfig(config || {}),
    frontmatter: frontmatter || {},
    referenceConfig: params.refsConfig,
  };
};

type Configs = {
  configJson?: string;
  configYaml?: string;
  configToml?: string;
};

export async function extractContents(
  handle: FileSystemFileHandle,
  configHandle: FileSystemFileHandle | null,
  imageHandles: FileSystemFileHandles,
  refsConfigHandle: FileSystemFileHandle | null,
): Promise<
  [
    string,
    Configs,
    Record<string, string>,
    { name: string; path: string; kind: string }[] | null,
    Error[],
  ]
> {
  let text = '';
  let imageUrls;
  let config: Configs = {};
  let refsConfig: { name: string; path: string; kind: string }[] | null = null;
  const errors: Error[] = [];
  try {
    // get docs.json from config handle
    const configText = await (await configHandle!.getFile()).text();
    if (configHandle?.name === 'docs.json') {
      config = { configJson: configText };
    } else if (configHandle?.name === 'docs.yaml') {
      config = { configYaml: configText };
    } else if (configHandle?.name === 'docs.toml') {
      config = { configToml: configText };
    }
  } catch (e) {
    console.error(e);
    throw new Error('Unable to find config file');
  }
  try {
    refsConfig = JSON.parse(await (await refsConfigHandle!.getFile()).text()) as {
      name: string;
      path: string;
      kind: string;
    }[];
  } catch (e) {
    refsConfig = null;
  }
  try {
    text = await (await handle.getFile()).text();
  } catch (e) {
    console.error('unable to get page content');
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
  } catch (_) {}

  if (config?.configToml) {
    config.configToml = config.configToml.replace('\\n', '');
  }

  return [text, config, imageUrls, refsConfig, errors];
}
