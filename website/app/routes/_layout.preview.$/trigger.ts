import {
  DirectoryPermissionsRequiredError,
  useDirectoryHandle,
  useHasFileSystemFeature,
} from "./utils";

const TRIGGER_STATES = [
  "UNSUPPORTED", // Browser does not support the required features.
  "LOADING", // Loading the directory.
  "PERMISSION_REQUIRED", // Permissions required to access the directory.
  "SELECT_DIRECTORY", // User needs to select a directory.
  "PREPARING", // Preparing the directory for preview.
] as const;

export function useTrigger(): {
  state: (typeof TRIGGER_STATES)[number];
  error?: Error;
} {
  const hasFeature = useHasFileSystemFeature();
  const directory = useDirectoryHandle();

  if (!hasFeature) {
    return { state: "UNSUPPORTED" };
  }

  if (directory.isLoading) {
    return { state: "LOADING" };
  }
  
  if (
    directory.isError &&
    directory.error instanceof DirectoryPermissionsRequiredError
  ) {
    return { state: "PERMISSION_REQUIRED", error: directory.error };
  }

  if (!directory.data) {
    return {
      state: "SELECT_DIRECTORY",
    };
  }

  return { state: "PREPARING" };
}
