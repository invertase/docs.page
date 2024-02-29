import React, { useState, useEffect } from 'react';

import { getPreview } from 'src/bundle';
import { replaceMoustacheVariables } from 'src/utils';

import context, { type Context } from 'src/context';

interface FileEntry {
  name: string;
  getFile: () => Promise<File>;
}

const DB_NAME = 'fileSystemAccessDB';
const STORE_NAME = 'fileHandles';
const DB_VERSION = 1;

const FilePicker: React.FC = () => {
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [mdxFiles, setMdxFiles] = useState<FileEntry[]>([]);
  const [indexMdxContent, setIndexMdxContent] = useState<string>('');
  const [configFileContent, setConfigFileContent] = useState<string>('');
  const [configFileType, setConfigFileType] = useState<'json' | 'yaml' | ''>('');

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = event => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveFileHandle(fileHandle) {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.put(fileHandle, 'fileHandleKey');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async function getFileHandle() {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get('fileHandleKey');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  const selectDirectory = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      setDirectoryHandle(handle);
      if (handle) {
        // Request permission to access this directory in the future
        const permission = await handle.requestPermission({ mode: 'readwrite' });
        if (permission === 'granted') {
          await saveFileHandle(handle);
        }
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
    }
  };

  async function restoreDirectoryAccess() {
    try {
      const fileHandle = await getFileHandle();
      if (fileHandle) {
        const permission = await fileHandle.queryPermission({ mode: 'readwrite' });
        if (permission === 'granted') {
          // You have access to the fileHandle
        } else {
          // Permission not granted, ask the user to select the directory again
          await selectDirectory();
        }
      } else {
        // No fileHandle saved, ask the user to select the directory
        await selectDirectory();
      }
    } catch (error) {
      console.error('Error restoring directory access:', error);
    }
  }

  const loadFilesRecursively = async (
    directoryHandle: FileSystemDirectoryHandle,
    path = '',
  ): Promise<FileEntry[]> => {
    let entries: FileEntry[] = [];
    for await (const entry of directoryHandle.values()) {
      const fullPath = path ? `${path}/${entry.name}` : entry.name;
      if (entry.kind === 'file' && fullPath.endsWith('.mdx')) {
        entries.push({ name: fullPath, getFile: entry.getFile });
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
  ): Promise<void> => {
    for (const filename of filenames) {
      try {
        const fileHandle = await handle.getFileHandle(filename, { create: false });
        const fileData = await fileHandle.getFile();
        setConfigFileContent(await fileData.text());
        setConfigFileType(filename.endsWith('.json') ? 'json' : 'yaml');
        return;
      } catch (error) {
        // File not found, continue trying other filenames
      }
    }
    // If none of the files are found, you can set an error state or message.
    console.error('Configuration file not found.');
  };

  const loadIndexMdx = async (directoryHandle: FileSystemDirectoryHandle): Promise<void> => {
    try {
      // Navigate to the /docs directory first
      const docsDirectoryHandle = await directoryHandle.getDirectoryHandle('docs', {
        create: false,
      });
      // Then, try to access index.mdx within /docs
      const fileHandle = await docsDirectoryHandle.getFileHandle('index.mdx', { create: false });
      const file = await fileHandle.getFile();
      const content = await file.text();
      setIndexMdxContent(content);
    } catch (error) {
      console.error('Error loading index.mdx:', error);
    }
  };

  useEffect(() => {
    const loadDirectoryContents = async () => {
      if (directoryHandle) {
        await loadConfigFile(directoryHandle, ['docs.json', 'docs.yaml']);
        try {
          // Load files from '/docs' directory
          const docsDirectoryHandle = await directoryHandle.getDirectoryHandle('docs', {
            create: false,
          });
          const files = await loadFilesRecursively(docsDirectoryHandle);
          setMdxFiles(files);
        } catch (error) {
          console.error('Error loading /docs directory:', error);
        }
      }
    };

    loadDirectoryContents();
    // Load index.mdx from /docs root
    if (directoryHandle) {
      loadIndexMdx(directoryHandle);
    }
  }, [directoryHandle]);

  const getCookie = (key: string) => {
    const b = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
  };

  useEffect(() => {
    // Assuming that configFileContent and indexMdxContent are available
    if (configFileContent && indexMdxContent) {
      getPreview({
        markdown: indexMdxContent,
        config: {
          [configFileType]: configFileContent,
        },
      })
        .then(response => {
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
              repository: 'preview',
              ref: 'preview',
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
            context.set(ctx);
            console.log('Context is set now!');
          } else {
            throw new Error('Failed to get preview');
          }
        })
        .catch(error => {
          console.error('Error in getPreview:', error);
        });
    }
  }, [configFileContent, indexMdxContent]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <button
        onClick={selectDirectory}
        className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      >
        Select Directory
      </button>
    </div>
  );
};

export default FilePicker;
