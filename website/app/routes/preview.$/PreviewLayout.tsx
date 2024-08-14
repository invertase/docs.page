import { Button } from "~/components/Button";
import {
  DirectoryPermissionsRequiredError,
  useDirectoryHandle,
  useHasFileSystemFeature,
  useRequestPermissions,
  useSelectDirectory,
} from "./utils";

export function PreviewLayout() {
  const hasFeature = useHasFileSystemFeature();
  const selectDirectory = useSelectDirectory();
  const requestPermissions = useRequestPermissions();
  const directory = useDirectoryHandle();

  if (!hasFeature) {
    return (
      <div className="space-y-6">
        <p className="text-red-500">
          Your browser does not support the required features to preview
          directories. Please check the{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://caniuse.com/?search=showDirectoryPicker"
            className="underline"
          >
            compatibility list
          </a>
          .
        </p>
      </div>
    );
  }

  if (directory.isLoading) {
    return (
      <Button
        cta
        as="button"
        disabled
        className="cursor-not-allowed opacity-50"
      >
        Select Directory
      </Button>
    );
  }

  if (
    directory.isError &&
    directory.error instanceof DirectoryPermissionsRequiredError
  ) {
    return (
      <div className="space-y-6">
        <p className="text-red-500">
          Please grant read access to the local "{directory.error.message}"
          directory to continue.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestPermissions.mutate();
          }}
        >
          <Button as="button" type="submit" cta>
            Grant Read Permission
          </Button>
        </form>
      </div>
    );
  }

  if (!directory.data) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          selectDirectory.mutate();
        }}
      >
        <Button cta as="button" type="submit">
          Select Directory
        </Button>
      </form>
    );
  }

  return <p>Loading files...</p>;
}
