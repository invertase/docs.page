import { useEffect, useState } from 'react';
import { BundleSuccess, OutputConfig } from '@docs.page/server';
import { DocumentationLoader } from '~/loaders/documentation.server';
import { useHashChange } from './hash-change';

export type FileSystemFileHandles = { [path: string]: FileSystemFileHandle };

type PreviewCache = {
  text?: string;
  config?: Configs;
  props?: string;
  urls?: Record<string, string>;
};
const cache: PreviewCache = {};

interface PolledLocalDocs {
  data: DocumentationLoader | null;
  urls?: Record<string, string>;
  error: number | null;
}

type Configs = {
  configJson?: string;
  configYaml?: string;
  configToml?: string;
};

type PreviewParams = {
  hash: string;
  config?: Configs;
  text: string;
  urls: Record<string, string>;
};

export function usePollLocalDocs(
  fileHandles: FileSystemFileHandles | null,
  configHandle: FileSystemFileHandle | null,
  ms = 500,
): PolledLocalDocs {
  const [updating, setUpdating] = useState(0);
  const [pageProps, setPageProps] = useState<DocumentationLoader | null>(null);
  const hash = useHashChange();
  const [error, setError] = useState<number | null>(null);

  useEffect(() => {
    if (fileHandles) {
      // TODO: image handles once we've sorted out Link and Image Links etc
      const imageHandles = Object.keys(fileHandles)
        .filter(key => ['.png', '.jpg', '.gif', '.jpeg'].some(ext => key.endsWith(ext)))
        .reduce((obj, key) => {
          //@ts-ignore
          obj[key] = fileHandles[key];
          return obj;
        }, {});

      const fileHandle = hash ? fileHandles[hash] : fileHandles[`/index.mdx`];

      const interval = setInterval(
        () =>
          extractContents(fileHandle, configHandle, imageHandles)
            .then(([text, config, urls]) => {
              if (text !== cache.text) {
                cache.urls = urls;
                cache.text = text;
                cache.config = config;
              }
              setUpdating(updating + 1);
            })
            .catch(() => {
              setError(404);
            }),
        ms,
      );
      return () => clearInterval(interval);
    }
  }, [hash, fileHandles, updating]);

  useEffect(() => {
    console.log('%c File change detected, hot update! 🔥', 'color: #8b0000;');
    buildPreviewProps({
      hash,
      config: cache.config,
      text: cache.text || '',
      urls: cache.urls || {},
    })
      .then(setPageProps)
      .then(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
  }, [cache.text, cache.config, cache.urls]);

  return { data: pageProps, urls: cache.urls, error };
}

const buildPreviewProps = async (params: PreviewParams): Promise<DocumentationLoader> => {
  const md = params.text;
  let code: string | null = null;
  let frontmatter: BundleSuccess['frontmatter'] | null = null;
  let headings: BundleSuccess['headings'] | null = null;
  let config: OutputConfig;
  const body = {
    md,
    config: params.config,
    baseBranch: 'main',
  };
  try {
    const host =
      //@ts-ignore
      window.ENV?.NODE_ENV === 'production' ? 'https://docs.page' : 'http://localhost:3001';
    const res = await fetch(`${host}/preview-fetch`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'docs-page-preview': 'true',
      },
      body: JSON.stringify(body),
    });

    const bundle = await res.json();
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
    config,
    frontmatter: frontmatter || {},
  };
};

export async function extractContents(
  handle: FileSystemFileHandle,
  configHandle: FileSystemFileHandle | null,
  imageHandles: FileSystemFileHandles,
): Promise<[string, Configs, Record<string, string>, Error[]]> {
  let text = '';
  let imageUrls;
  let config: Configs = {};
  const errors: Error[] = [];
  try {
    // get config from handle
    const configText = await (await configHandle!.getFile()).text();
    const configExt = configHandle?.name;

    if (configExt === 'docs.json') {
      config = { configJson: configText };
    } else if (configExt === 'docs.yaml') {
      config = { configYaml: configText };
    } else if (configExt === 'docs.toml') {
      config = { configToml: configText };
    }
  } catch (e) {
    console.error(e);
    throw new Error('Unable to find config file');
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

  return [text, config, imageUrls, errors];
}
