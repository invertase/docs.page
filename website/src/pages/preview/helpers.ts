import { openDB } from 'idb';
import type { MapStore, Store } from 'nanostores';
import { getPreview, type GetPreviewResponse } from 'src/bundle';
import type { Context } from 'src/context';
import { replaceMoustacheVariables } from 'src/utils';

export interface FileEntry {
  name: string;
  content: string;
}

const DB_NAME = 'docspage-preview-store';
const STORE_NAME = 'docspage-preview-files';
const CONTEXT_KEY = 'context';
const FILE_HANDLE_KEY = 'filehandle';
const CONFIG_KEY = 'config';
const DB_VERSION = 1;

const _db = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});
export const isFileSystemAccessAPIAvailable = () => {
  return 'showDirectoryPicker' in window;
};

export async function saveToIDb(key: string, value: any): Promise<void> {
  const db = await _db;
  await db.put(STORE_NAME, value, key);
}

export async function getFromIDb(key: string): Promise<any> {
  const db = await _db;
  return db.get(STORE_NAME, key);
}

export async function saveFileHandleInIDB(fileHandle: FileSystemDirectoryHandle): Promise<void> {
  return saveToIDb(FILE_HANDLE_KEY, fileHandle);
}
export async function getFileHandleFromIDB(): Promise<FileSystemDirectoryHandle | undefined> {
  return getFromIDb(FILE_HANDLE_KEY);
}
export async function addFileToDb(file: FileEntry): Promise<void> {
  await saveToIDb(file.name, file.content);
}
export async function saveContextInIDB(ctx: Context, fileName: string): Promise<void> {
  await saveToIDb(CONTEXT_KEY + fileName, JSON.stringify(ctx));
}
export async function saveConfigInDb(config: {
  type: 'json' | 'yaml';
  content: string;
}): Promise<void> {
  await saveToIDb(CONFIG_KEY, JSON.stringify(config));
}

export async function loadConfigFromDb(): Promise<
  | {
      type: 'json' | 'yaml';
      content: string;
    }
  | undefined
> {
  const config = await getFromIDb(CONFIG_KEY);
  if (config) return JSON.parse(config);
}

export async function loadContextFromDb(possibleFileKeys: string[]): Promise<Context | undefined> {
  const promises = [];
  for (const fileKey of possibleFileKeys) {
    promises.push(await getFromIDb(CONTEXT_KEY + fileKey));
  }
  const result = await Promise.all(promises);
  const context = result.find(Boolean);
  if (context) {
    return JSON.parse(context);
  }
}

export async function readFileFromDb(fileName: string): Promise<string | undefined> {
  return getFromIDb(fileName);
}

export const loadConfigFile = async (
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

export const loadDirectoryContents = async (
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
    const { type, content } = await loadConfigFile(directoryHandle, ['docs.json', 'docs.yaml']);
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

export const loadFilesRecursively = async (
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

export const getCookie = (key: string) => {
  const b = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
};

export const fetchIndex = async (
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

    // Get any synchronized tabs
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

export async function verifyPermission(dirHandle: FileSystemDirectoryHandle, readWrite: boolean) {
  const options: any = {};
  if (readWrite) {
    options.mode = 'readwrite';
  }
  // Check if permission was already granted. If so, return true.
  if ((await dirHandle.queryPermission(options)) === 'granted') {
    return true;
  }
  // Request permission. If the user grants permission, return true.
  if ((await dirHandle.requestPermission(options)) === 'granted') {
    return true;
  }
  // The user didn't grant permission, so return false.
  return false;
}

export async function init(possibleFileKeys: string[], context: MapStore<Context>) {
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

export const loadContents = async (
  dirHandle: FileSystemDirectoryHandle,
  context: MapStore<Context>,
) => {
  console.log('Loading contents from directory:', dirHandle);
  const content = await loadDirectoryContents(dirHandle);
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
  }
};
