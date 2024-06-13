import { useParams } from '@remix-run/react';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { openDB, type IDBPDatabase, type DBSchema } from 'idb';

interface Database extends DBSchema {
  handles: {
    key: string;
    value: FileSystemDirectoryHandle;
  };
  files: {
    key: string;
    value: string;
  };
}

export const queryClient = new QueryClient();

let _db: IDBPDatabase<Database> | undefined;

// Opens a database and creates the necessary object stores.
async function openDatabase() {
  return (_db ??= await openDB<Database>('todo', 2, {
    upgrade(db) {
      db.createObjectStore('handles');
      db.createObjectStore('files');
    },
  }));
}

// Load the directory handle from the database.
// Stores all the important entities in the directory in the database.
export function useDirectoryHandle() {
  return useQuery({
    queryKey: ['directory-handle'],
    refetchInterval: 500,
    queryFn: async () => {
      const db = await openDatabase();

      // Get a saved directory handle from the database.
      const handle = await db.get('handles', 'directory');

      // If no handle is stored, return null.
      if (!handle) {
        return null;
      }

      // Verify we can access the directory.
      const verified = await verifyPermission(handle);

      // If we can't access the directory, delete the handle and return null.
      if (!verified) {
        await db.delete('handles', 'directory');
        return null;
      }

      // Get the contents of a file, and return empty string if it doesn't exist.
      async function getFileContent(file: FileSystemFileHandle) {
        return file
          .getFile()
          .then(file => file.text())
          .catch(() => '');
      }

      // Create handles for each important entity in the directory.
      const docsDirectoryHandle = await handle.getDirectoryHandle('docs').catch(() => null);
      const yamlConfigHandle = await handle.getFileHandle('docs.yaml').catch(() => null);
      const jsonConfigHandle = await handle.getFileHandle('docs.json').catch(() => null);

      // Insert the contents of the files into the database.
      if (yamlConfigHandle)
        await db.put('files', await getFileContent(yamlConfigHandle), 'docs.yaml');

      if (jsonConfigHandle)
        await db.put('files', await getFileContent(jsonConfigHandle), 'docs.json');

      // Recursively walk the docs directory and get the contents of each file.
      async function walkDirectory(dir: FileSystemDirectoryHandle, path: string) {
        for await (const entry of dir.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            await db.put('files', await file.text(), path + file.name);
          } else {
            await walkDirectory(entry as FileSystemDirectoryHandle, path + entry.name + '/');
          }
        }
      }

      // Walk the `docs` directory, if it exists.
      if (docsDirectoryHandle) {
        await walkDirectory(docsDirectoryHandle, '/');
      }

      return handle;
    },
  });
}

// Load the current page content from the database.
export function usePageContent(directory?: FileSystemDirectoryHandle | null) {
  const params = useParams();
  const path = params['*'] ? `/${params['*']}` : '/';

  return useQuery({
    enabled: !!directory,
    queryKey: ['page-context', directory?.name, path],
    refetchInterval: 500,
    retry: false,
    queryFn: async () => {
      const db = await openDatabase();

      // First check if we even have a file in the database for this path.
      const [file1, file2] = await Promise.all([
        db.get('files', path + 'index.mdx'),
        db.get('files', path + '.mdx'),
      ]);
      
      // If neither file exists, return a code...?
      if (!file1 && !file2) {
        throw new Error('File not found');
      }

      // Next get the config file(s) from the database.
      const [yamlConfig, jsonConfig] = await Promise.all([
        db.get('files', 'docs.yaml'),
        db.get('files', 'docs.json'),
      ]);

      return {
        config: {
          yaml: yamlConfig ?? null,
          json: jsonConfig ?? null,
        },
        markdown: file1 ?? file2 ?? null,
      };
    },
  });
}

// Mutation to select a directory and store it in the database.
// On success, invalidate the page context query so it will re-fetch.
export function useSelectDirectory() {
  return useMutation({
    mutationFn: async () => {
      const db = await openDatabase();
      const directory = await window.showDirectoryPicker();
      await db.put('handles', directory, 'directory');
    },
    onSuccess: () => {
      // Invalidate the page context query so it will re-fetch.
      queryClient.invalidateQueries({ queryKey: ['page-context'] });
    },
  });
}

// Helper function to verify permission to access a directory, and request it if needed.
async function verifyPermission(directory: FileSystemDirectoryHandle) {
  if ((await directory.queryPermission()) === 'granted') {
    return true;
  }

  if ((await directory.requestPermission()) === 'granted') {
    return true;
  }

  return false;
}
