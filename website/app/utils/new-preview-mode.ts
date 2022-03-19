import { useCallback, useEffect, useRef, useState } from 'react';
import { DocumentationLoader } from '~/loaders/documentation.server';

const HOST =
  //@ts-ignore
  window.ENV?.NODE_ENV === 'production' ? 'https://docs.page' : 'http://localhost:3001';

type FileSystemFileHandles = { [path: string]: FileSystemFileHandle };

function useInterval<T>(callback: (input: T) => void | Promise<void>, delay: number | null) {
  //@ts-ignore
  const savedCallback = useRef<() => void>(() => null);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [callback, delay]);
}

function useHashChange(): string {
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

interface PollHandlesParams {
  fileHandles: FileSystemFileHandles;
  configHandle: FileSystemFileHandle;
  imageHandles: FileSystemFileHandles;
  hash: string;
}

type Cache = {
  config?: Configs;
  content?: string;
  imageUrls?: Record<string, string>;
};

let cache: Cache = {};

function updateCache(data: Cache) {
  cache = {
    ...cache,
    ...data,
  };
}

async function pollHandles({ fileHandles, configHandle, imageHandles, hash }: PollHandlesParams) {
  const config = await pollConfig(configHandle);

  const fileHandle = hash ? fileHandles[hash] : fileHandles[`/index.mdx`];

  const content = await pollContent(fileHandle);

  const imageUrls = await extractImageUrls(imageHandles);

  if (
    (cache.config && cache.config !== config) ||
    (cache.content && cache.content !== content) ||
    (cache.imageUrls && cache.imageUrls !== imageUrls)
  ) {
    updateCache({
      config,
      content,
      imageUrls,
    });
  }
}

export function usePreviewMode(handles: Omit<PollHandlesParams, 'hash'>) {
  const hash = useHashChange();

  useInterval<PollHandlesParams>(() => pollHandles({ ...handles, hash }), 500);

  useEffect(() => {
    const body = {
      md: cache.content,
      config: cache.config,
      baseBranch: 'main',
    };

    fetch(`${HOST}/preview-fetch`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'docs-page-preview': 'true',
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then((bundle: DocumentationLoader) => {
        return {
          owner: 'preview',
          repo: 'docs',
          path: '',
          ref: 'HEAD',
          baseBranch: 'main',
          source: { type: 'branch', owner: 'preview', repository: 'docs', ref: 'ref' },
          code: bundle.code || '',
          headings: bundle.headings,
          config: bundle.config || {},
          frontmatter: bundle.frontmatter || {},
        };
      });
  }, [cache.content]);
}

type Configs = {
  configJson?: string;
  configYaml?: string;
  configToml?: string;
};

type ConfigFileName = 'docs.json' | 'docs.yaml' | 'docs.toml';

async function pollConfig(configHandle: FileSystemFileHandle) {
  let config: Configs;

  try {
    const configText = await (await configHandle!.getFile()).text();

    switch (configHandle?.name as ConfigFileName) {
      case 'docs.json':
        config = { configJson: configText };
      case 'docs.yaml':
        config = { configYaml: configText };
      case 'docs.toml':
        config = { configToml: configText };
    }
    return config;
  } catch (e) {
    console.error(e);
    throw new Error('Unable to find config file');
  }
}

async function pollContent(fileHandle: FileSystemFileHandle) {
  try {
    return await (await fileHandle.getFile()).text();
  } catch (e) {
    throw Error('failed to get file contents');
  }
}

async function extractImageUrls(imageHandles: FileSystemFileHandles) {
  try {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(imageHandles).map(async ([key, handle]) => {
          const url = URL.createObjectURL(await handle.getFile());
          return [key, url];
        }),
      ),
    );
  } catch (_) {
    throw Error();
  }
}

interface DirectorySelector {
  select: () => void;
  handles: FileSystemFileHandles | null;
  error: Error | null;
  pending: boolean;
  configHandle: FileSystemFileHandle | null;
}

export function useDirectorySelector(): DirectorySelector {
  const [error, setError] = useState<Error | null>(null);
  const [pending, setPending] = useState(false);
  const [handles, setHandles] = useState<FileSystemFileHandles | null>(null);
  const [configHandle, setConfigHandle] = useState<FileSystemFileHandle | null>(null);

  const select = useCallback(async () => {
    setPending(true);
    try {
      const handle = (await window.showDirectoryPicker()) || null;

      let docs: FileSystemDirectoryHandle | null = null;
      let foundConfig = false;
      for await (const entry of handle.values()) {
        if (
          !foundConfig &&
          entry.kind === 'file' &&
          ['docs.json', 'docs.yaml', 'docs.toml'].includes(entry.name)
        ) {
          setConfigHandle(entry);
          foundConfig = true;
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
