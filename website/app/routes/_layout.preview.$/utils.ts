import { type CheckResult, check } from "@docs.page/cli";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import mime from "mime";
import { ensureLeadingSlash } from "~/utils";

const DATABASE = "docs.page";
const DATABASE_VERSION = 2;
const REFETCH_INTERVAL = 1000;

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

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

let _db: IDBPDatabase<Database> | undefined;

// Opens a database and creates the necessary object stores.
async function openDatabase() {
  if (_db) {
    return _db;
  }

  _db ??= await openDB<Database>(DATABASE, DATABASE_VERSION, {
    upgrade(db) {
      db.createObjectStore("handles");
      db.createObjectStore("files");
    },
  });

  return _db;
}

export function useHasFileSystemFeature() {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}

export function useRequestPermissions() {
  return useMutation({
    mutationFn: async () => {
      const db = await openDatabase();
      const handle = await db.get("handles", "directory");

      if (!handle) {
        throw new Error("No directory available to grant permissions.");
      }

      const verified = await verifyPermission(handle).catch((e) => {
        console.error(e);
        throw new DirectoryPermissionsRequiredError();
      });

      return verified;
    },
    onSuccess: () => {
      // Invalidate the page context query so it will re-fetch.
      queryClient.invalidateQueries({ queryKey: ["directory-handle"] });
    },
  });
}

// Load the directory handle from the database.
// Stores all the important entities in the directory in the database.
export function useDirectoryHandle() {
  return useQuery({
    queryKey: ["directory-handle"],
    retry: false,
    refetchInterval: (ctx) => {
      // If there's an error, don't refetch files.
      return ctx.state.error ? false : REFETCH_INTERVAL;
    },
    queryFn: async () => {
      const db = await openDatabase();

      // Get a saved directory handle from the database.
      const handle = await db.get("handles", "directory");

      // If no handle is stored, return null.
      if (!handle) {
        return null;
      }

      // Verify we can access the directory.
      const verified = await verifyPermission(handle).catch((e) => {
        console.error(e);
        throw new DirectoryPermissionsRequiredError(handle.name);
      });

      // Get all the files stored in the database.
      const files = await db.getAllKeys("files");

      // Keep track of all the files we've discovered.
      const discoveredFiles: string[] = [];

      // If we can't access the directory, delete the handle & files and return null.
      if (!verified) {
        return null;
      }

      // Get the contents of a file, and return empty string if it doesn't exist.
      async function getFileContent(file: FileSystemFileHandle) {
        return file
          .getFile()
          .then((file) => file.text())
          .catch(() => "");
      }

      // Create handles for each important entity in the directory.
      const docsDirectoryHandle = await handle
        .getDirectoryHandle("docs")
        .catch(() => null);
      const yamlConfigHandle = await handle
        .getFileHandle("docs.yaml")
        .catch(() => null);
      const jsonConfigHandle = await handle
        .getFileHandle("docs.json")
        .catch(() => null);

      // Insert the contents of the files into the database.
      if (yamlConfigHandle) {
        await db.put(
          "files",
          await getFileContent(yamlConfigHandle),
          "docs.yaml",
        );

        discoveredFiles.push("docs.yaml");
      }

      if (jsonConfigHandle) {
        await db.put(
          "files",
          await getFileContent(jsonConfigHandle),
          "docs.json",
        );

        discoveredFiles.push("docs.json");
      }

      // Recursively walk the docs directory and get the contents of each file.
      async function walkDirectory(
        dir: FileSystemDirectoryHandle,
        path: string,
      ) {
        for await (const entry of dir.values()) {
          if (entry.kind === "file") {
            const file = await entry.getFile();
            const key = path + file.name;

            // Keep track of the file.
            discoveredFiles.push(key);

            // Store MDX files as plain text
            if (key.endsWith("mdx")) {
              await db.put("files", await file.text(), key);
            }
            // Store other files as blob URLs
            else {
              const type = mime.getType(file.name) ?? undefined;
              const buffer = await file.arrayBuffer();
              const blob = new Blob([buffer], { type });
              await db.put("files", URL.createObjectURL(blob), key);
            }
          } else {
            await walkDirectory(
              entry as FileSystemDirectoryHandle,
              `${path + entry.name}/`,
            );
          }
        }
      }

      if (docsDirectoryHandle) {
        // Walk the `docs` directory, if it exists.
        await walkDirectory(docsDirectoryHandle, "/");

        // Delete any files that are no longer in the directory.
        await Promise.all(
          files.map(async (file) => {
            if (!discoveredFiles.includes(file)) {
              await db.delete("files", file);
            }
          }),
        );
      } else {
        // If the `docs` directory doesn't exist, delete all files.
        await Promise.all(files.map((file) => db.delete("files", file)));
      }

      return handle;
    },
  });
}

// Load all the files from the database.
export function useFiles(enabled = true) {
  return useQuery({
    queryKey: ["files"],
    refetchInterval: REFETCH_INTERVAL,
    enabled,
    queryFn: async () => {
      const db = await openDatabase();
      const keys = await db.getAllKeys("files");

      const files: Record<string, string | undefined> = {};

      await Promise.all(
        keys.map(async (key) => {
          files[key] = await db.get("files", key);
        }),
      );

      return files;
    },
  });
}

// Load the current page content from the database.
export function usePageContent(
  path: string,
  directory?: FileSystemDirectoryHandle | null,
) {
  return useQuery({
    enabled: !!directory,
    queryKey: ["page-context", directory?.name, path],
    refetchInterval: (ctx) => {
      // If there's an error, don't refetch files.
      return ctx.state.error ? false : REFETCH_INTERVAL;
    },
    retry: false,
    queryFn: async () => {
      const db = await openDatabase();

      // Next get the config file(s) from the database.
      const [yamlConfig, jsonConfig] = await Promise.all([
        db.get("files", "docs.yaml"),
        db.get("files", "docs.json"),
      ]);

      if (!yamlConfig && !jsonConfig) {
        throw new ConfigurationFileNotFoundError();
      }

      const filePath = path === "" ? "" : ensureLeadingSlash(path);

      const filePaths = [`${filePath}/index.mdx`, `${filePath}.mdx`];

      // First check if we even have a file in the database for this path.
      const [file1, file2] = await Promise.all(
        filePaths.map((filePath) => db.get("files", filePath)),
      );

      // If neither file exists, return a code...?
      if (!file1 && !file2) {
        throw new FileNotFoundError(filePath, filePaths);
      }

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

export function useCheckResult() {
  return useQuery({
    queryKey: ["check"],
    refetchInterval: REFETCH_INTERVAL,
    queryFn: async () => {
      const results: CheckResult[] = [];

      const db = await openDatabase();

      // Get all the files stored in the database.
      const files = await db.getAllKeys("files");

      // Convert the file paths to the format expected by the CLI.
      const fileSet = new Set(
        files.map((key) => {
          return key.startsWith("/") ? `docs${key}` : key;
        }),
      );

      // This is the function that will be called by the CLI to get the content of a file.
      async function getFileFn(relativePath: string) {
        // Paths from the CLI come through as `docs/hello/world.mdx`, so we need to convert them to `/hello/world.mdx`.
        return (
          (await db.get("files", relativePath.replace(/^docs\//, "/"))) || ""
        );
      }

      for await (const result of check(fileSet, getFileFn)) {
        results.push(result);
      }

      return results;
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
      await db.put("handles", directory, "directory");
    },
    onSuccess: () => {
      // Invalidate the page context query so it will re-fetch.
      queryClient.invalidateQueries({ queryKey: ["page-context"] });
    },
  });
}

// Mutation to restart the app by deleting all stored data.
export function useRestart() {
  return useMutation({
    mutationFn: async () => {
      const db = await openDatabase();
      await db.delete("handles", "directory");
      const files = await db.getAllKeys("files");
      await Promise.all(files.map((file) => db.delete("files", file)));
    },
    onSuccess: () => {
      // Invalidate the page context query so it will re-fetch.
      queryClient.invalidateQueries({ queryKey: ["directory-handle"] });
      queryClient.invalidateQueries({ queryKey: ["page-context"] });
    },
  });
}

// Returns a file from the database.
export async function getFile(path: string) {
  const db = await openDatabase();
  return db.get("files", path);
}

// Helper function to verify permission to access a directory, and request it if needed.
async function verifyPermission(directory: FileSystemDirectoryHandle) {
  if ((await directory.queryPermission()) === "granted") {
    return true;
  }

  if ((await directory.requestPermission()) === "granted") {
    return true;
  }

  return false;
}

export class DirectoryPermissionsRequiredError extends Error {}

export class FileNotFoundError extends Error {
  constructor(
    path: string,
    public filePaths: string[],
  ) {
    super(`File not found: ${path}`);
  }
}

export class ConfigurationFileNotFoundError extends Error {
  constructor() {
    super("Configuration file not found");
  }
}
