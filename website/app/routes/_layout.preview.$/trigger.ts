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

// export function Trigger() {
//   const hasFeature = useHasFileSystemFeature();
//   const selectDirectory = useSelectDirectory();
//   const requestPermissions = useRequestPermissions();
//   const directory = useDirectoryHandle();

//   if (!hasFeature) {
//     return (
//       <div className="space-y-6">
//         <p className="text-red-500">
//           Your browser does not support the required features to preview
//           directories. Please check the{" "}
//           <a
//             target="_blank"
//             rel="noreferrer"
//             href="https://caniuse.com/?search=showDirectoryPicker"
//             className="underline"
//           >
//             compatibility list
//           </a>
//           .
//         </p>
//       </div>
//     );
//   }

//   if (directory.isLoading) {
//     return (
//       <Button
//         cta
//         as="button"
//         disabled
//         className="cursor-not-allowed opacity-50"
//       >
//         Select Directory
//       </Button>
//     );
//   }

//   if (
//     directory.isError &&
//     directory.error instanceof DirectoryPermissionsRequiredError
//   ) {
//     return (
//       <div className="space-y-6">
//         <p className="text-red-500">
//           Please grant read access to the local "{directory.error.message}"
//           directory to continue.
//         </p>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             requestPermissions.mutate();
//           }}
//         >
//           <Button as="button" type="submit" cta>
//             Grant Read Permission
//           </Button>
//         </form>
//       </div>
//     );
//   }

//   if (!directory.data) {
//     return (
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           selectDirectory.mutate();
//         }}
//       >
//         <Button cta as="button" type="submit">
//           Select Directory
//         </Button>
//       </form>
//     );
//   }

//   return <p>Loading files...</p>;
// }
