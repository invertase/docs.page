import { detect } from 'detect-browser';
import { getPreview, type GetPreviewResponse } from 'src/bundle';
import context, { type Context } from 'src/context';
import { replaceMoustacheVariables } from 'src/utils';
import { openDB } from 'idb';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import DocsView from '@layouts/DocsView';
import Footer from '@layouts/Footer';

interface FileEntry {
  name: string;
  content: string;
}

export default function Preview(props: { previewPath?: string | undefined }) {
  const { previewPath } = props;
  const { isPreviewReady } = useStore(context);
  const browser = detect();

  useEffect(() => {
    const DB_NAME = 'docspage-preview-store';
    const STORE_NAME = 'docspage-preview-files';
    const CONTEXT_KEY = 'context';
    const CONFIG_KEY = 'config';
    const DB_VERSION = 1;

    const _db = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });

    async function addFileToDb(file: FileEntry): Promise<void> {
      const db = await _db;
      await db.put(STORE_NAME, file.content, file.name);
    }
    async function saveContextInIDB(ctx: Context, fileName: string): Promise<void> {
      const db = await _db;
      db.put(STORE_NAME, JSON.stringify(ctx), CONTEXT_KEY + fileName);
    }
    async function saveConfigInDb(config: {
      type: 'json' | 'yaml';
      content: string;
    }): Promise<void> {
      const db = await _db;
      db.put(STORE_NAME, JSON.stringify(config), CONFIG_KEY);
    }

    async function loadConfigFromDb(): Promise<
      | {
          type: 'json' | 'yaml';
          content: string;
        }
      | undefined
    > {
      const db = await _db;
      const config = await db.get(STORE_NAME, CONFIG_KEY);
      if (config) return JSON.parse(config);
    }

    async function loadContextFromDb(possibleFileKeys: string[]): Promise<Context | undefined> {
      const db = await _db;
      const promises = [];
      for (const fileKey of possibleFileKeys) {
        promises.push(await db.get(STORE_NAME, CONTEXT_KEY + fileKey));
      }
      const result = await Promise.all(promises);
      const context = result.find(Boolean);
      if (context) {
        return JSON.parse(context);
      }
    }

    async function readFileFromDb(fileName: string): Promise<string> {
      const db = await _db;
      return db.get(STORE_NAME, fileName);
    }

    async function init(possibleFileKeys: string[]) {
      const loadFilesRecursively = async (
        directoryHandle: FileSystemDirectoryHandle,
        path = '',
      ): Promise<FileEntry[]> => {
        let entries: FileEntry[] = [];
        // @ts-ignore
        for await (const entry of directoryHandle.values()) {
          const fullPath = path ? `${path}/${entry.name}` : entry.name;
          if (entry.kind === 'file' && fullPath.endsWith('.mdx')) {
            const file = await entry.getFile();
            const content = await file.text();
            entries.push({ name: fullPath, content });
          } else if (entry.kind === 'directory') {
            const subDirectoryHandle = await directoryHandle.getDirectoryHandle(entry.name, {
              create: false,
            });
            const subEntries = await loadFilesRecursively(subDirectoryHandle, fullPath);
            entries = entries.concat(subEntries);
          }
        }
        return entries;
      };
      const loadConfigFile = async (
        handle: FileSystemDirectoryHandle,
        filenames: string[],
      ): Promise<{
        type: 'json' | 'yaml';
        content: string;
      }> => {
        let content = '';
        let type: 'json' | 'yaml' = 'json';
        for (const filename of filenames) {
          try {
            const fileHandle = await handle.getFileHandle(filename, { create: false });
            const fileData = await fileHandle.getFile();
            content = await fileData.text();
            type = filename.endsWith('.json') ? 'json' : 'yaml';
          } catch (error) {
            // File not found, continue trying other filenames
          }
        }
        return {
          type,
          content,
        };
      };
      const loadDirectoryContents = async (
        directoryHandle: FileSystemDirectoryHandle,
      ): Promise<
        | {
            config: {
              type: 'json' | 'yaml';
              content: string;
            };
            files: FileEntry[];
          }
        | undefined
        | Promise<undefined>
      > => {
        try {
          const { type, content } = await loadConfigFile(directoryHandle, [
            'docs.json',
            'docs.yaml',
          ]);
          // Load files from '/docs' directory
          const docsDirectoryHandle = await directoryHandle.getDirectoryHandle('docs', {
            create: false,
          });
          const files = await loadFilesRecursively(docsDirectoryHandle);
          return {
            config: {
              type: type,
              content: content,
            },
            files,
          };
        } catch (error) {
          console.error('Error loading /docs directory:', error);
        }
      };

      const getCookie = (key: string) => {
        const b = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
      };

      const fetchIndex = async (
        config: { type: 'json' | 'yaml'; content: string },
        markdown: string,
      ): Promise<Context | undefined> => {
        const response: GetPreviewResponse = await getPreview({
          markdown: markdown,
          config: {
            [config.type]: config.content,
          },
        });
        // Set the theme color
        const theme = getCookie('theme');
        // Assuming response structure, adjust as needed
        if (response.code === 'OK') {
          const { code, config, frontmatter, headings } = response.data;

          // Get any syncronized tabs
          let tabs = {};
          try {
            tabs = JSON.parse(getCookie('tabs') || '') ?? {};
          } catch {}

          let relativePath = '/';
          let locale: string | undefined;

          // Check whether the request is for a valid locale.
          if (config.locales.length) {
            [locale] = relativePath.split('/').filter(Boolean);
            if (!config.locales.includes(locale)) {
              locale = undefined;
            } else {
              relativePath = relativePath.replace(`/${locale}`, '');
            }
          }

          // Figure out the sidebar based on the locale.
          let sidebar = [];
          if (locale && !Array.isArray(config.sidebar)) {
            sidebar = config.sidebar[locale];
          } else if (!Array.isArray(config.sidebar)) {
            sidebar = config.sidebar['default'] || [];
          } else {
            sidebar = config.sidebar;
          }

          const ctx: Context = {
            isPreviewReady: true,
            frontmatter: frontmatter,
            headings: headings,
            code: replaceMoustacheVariables(config.variables ?? {}, code),
            config: config,
            owner: 'preview',
            repository: '',
            ref: '',
            locale,
            relativePath: '',
            githubPath: '',
            githubRefPath: '',
            sidebar,
            domain: '',
            baseBranch: '',
            source: {
              type: 'commit',
              owner: '',
              repository: '',
              ref: '',
            },
            theme: theme ? (theme === 'dark' ? 'dark' : 'light') : undefined,
            tabs,
          };
          return ctx;
        } else {
          throw new Error('Failed to get preview');
        }
      };

      const selectDirectoryButtonEl = document.querySelector('#select-directory');
      const directoryContainerEl = document.querySelector('#directory-container');
      const selectDirectory = async () => {
        try {
          const handle = await (window as any).showDirectoryPicker();
          const content = await loadDirectoryContents(handle);
          if (content) {
            const { config, files } = content;

            for (const file of files) {
              await addFileToDb(file);
            }
            const markdownFiles = files.filter(
              file => file.name === 'index.mdx' || file.name === 'index.md',
            );
            const indexMarkdownFile = markdownFiles[0];
            if (!indexMarkdownFile) {
              console.error('No index.mdx or index.md file found in /docs directory');
              return;
            }
            saveConfigInDb(config);
            const ctx = await fetchIndex(config, indexMarkdownFile.content);
            if (ctx) {
              saveContextInIDB(ctx, indexMarkdownFile.name);
              context.set(ctx);
            }
            // directoryContainerEl?.remove();
          }
          // if (handle) {
          //   // Request permission to access this directory in the future
          //   const permission = await handle.requestPermission({ mode: 'readwrite' });
          //   if (permission === 'granted') {
          //     // await saveFileHandle(handle);
          //   }
          // }
        } catch (error) {
          console.error('Error selecting directory:', error);
        }
      };
      selectDirectoryButtonEl?.addEventListener('click', selectDirectory);

      if (possibleFileKeys && possibleFileKeys.length) {
        const config = await loadConfigFromDb();
        if (config) {
          const promises = [];
          for (const fileKey of possibleFileKeys) {
            promises.push(await readFileFromDb(fileKey));
          }
          const result = await Promise.all(promises);
          const file = result.find(Boolean);
          if (file) {
            const ctx = await fetchIndex(config, file);
            if (ctx) {
              context.set(ctx);
            }
          }
        }
      }
    }

    const possibleFileKeys = previewPath
      ? [`${previewPath}/index.mdx`, `${previewPath}.mdx`]
      : ['index.mdx'];

    console.log('possibleFileKeys', possibleFileKeys);
    loadContextFromDb(possibleFileKeys).then(ctx => {
      if (ctx) {
        console.log('Loaded context from IDB:', possibleFileKeys, ctx);
        context.set(ctx);
      } else {
        init(possibleFileKeys);
      }
    });
  }, []);

  return isPreviewReady ? (
    <DocsView />
  ) : (
    <div className="dark:text-white">
      <section className="items-center py-16 px-4 text-center lg:py-32 lg:text-left">
        <div className="mx-auto max-w-6xl tracking-wider">
          <div className="mb-4 flex items-center justify-center space-x-4 lg:justify-between">
            <div className="flex items-center justify-start space-x-4 text-center">
              <h3 className="font-anton text-4xl">docs.page</h3>
              <h3 className="italic">Local Preview Mode (Beta)</h3>
            </div>
          </div>
          <h1 className=" font-anton mt-40 mb-4 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-center text-2xl text-transparent dark:from-gray-100 dark:via-gray-300 dark:to-gray-200 lg:text-5xl">
            Preview from your machine, with{' '}
            <span className="bg-gradient-to-br from-red-600 to-black bg-clip-text text-transparent dark:from-yellow-200 dark:to-red-400">
              hot reload.
            </span>{' '}
            <span className="bg-gradient-to-br from-red-800 to-violet-500 bg-clip-text text-transparent"></span>
          </h1>
          {browser?.name === 'chrome' ? (
            <>
              <p suppressHydrationWarning className="pt-20 text-center">
                To get started, simply select the local directory containing your docs.json config
                file:
              </p>
              <div className="w-100% content-center items-center justify-center pt-8 text-center">
                <button
                  className="text-s cursor-pointer whitespace-nowrap rounded-lg bg-green-600 px-3 py-2 text-white shadow transition-colors hover:bg-green-500"
                  id="select-directory"
                >
                  Select Directory!
                </button>
                <div
                  id="directory-container"
                  className="flex h-screen flex-col items-center justify-center"
                ></div>
              </div>
            </>
          ) : (
            <p suppressHydrationWarning className="pt-20 text-center">
              Local Preview Mode is only available on Chrome at the moment, sorry :(
            </p>
          )}
        </div>
        <div className="mx-auto mt-32 max-w-5xl px-4 lg:px-0">
          <Footer />
        </div>
      </section>
    </div>
  );
}
