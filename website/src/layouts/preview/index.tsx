import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTrigger } from "./trigger";
import {
  ConfigurationFileNotFoundError,
  FileNotFoundError,
  getFile,
  queryClient,
  useDirectoryHandle,
  usePageContent,
  useRequestPermissions,
  useRestart,
  useSelectDirectory,
} from "./utils";

import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/components/Button";
import { PageContext } from "~/context";
import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { cn, ensureLeadingSlash } from "~/utils";
import { DocumentationLayout } from "../Documentation";
import { Site } from "../Site";
import { Toolbar } from "./Toolbar";

export default function PreviewOutlet() {
  return (
    <QueryClientProvider client={queryClient}>
      <Preview />
    </QueryClientProvider>
  );
}

function Preview() {
  const [client, setClient] = useState(false);
  const router = useRouter();
  const path = router.asPath.replace("/preview", "");

  const directory = useDirectoryHandle();
  const content = usePageContent(path, directory.data);

  useEffect(() => {
    setClient(true);
  }, []);

  if (
    content.isFetched &&
    content.error &&
    content.error instanceof ConfigurationFileNotFoundError
  ) {
    return (
      <>
        <Header />
        <div className="p-6 text-center max-w-2xl w-full mx-auto my-24">
          <h1 className="text-4xl font-bold text-brand-50 mb-3">
            No Configuration File Found
          </h1>
          <div className="text-brand-100 space-y-3">
            <p>
              The selected directory does not contain a docs.json configuration
              file.
            </p>
            <p>
              To get started, create a docs.json file at the root of your
              project. Read the{" "}
              <a
                href="https://use.docs.page/configuration"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                documentation
              </a>{" "}
              for more information on how to create a configuration file.
            </p>
          </div>
        </div>
        <Footer />
        <Toolbar />
      </>
    );
  }

  if (
    content.isFetched &&
    content.error &&
    content.error instanceof FileNotFoundError
  ) {
    return (
      <>
        <Header />
        <div className="p-6 text-center max-w-5xl w-full mx-auto my-24">
          <h1 className="text-4xl font-bold text-brand-50 mb-3">
            File Not Found
          </h1>
          <div className="text-brand-100 space-y-3">
            <p>The file you are trying to preview could not be found.</p>
            <p>
              To get started, please add a new MDX file to one of the following
              paths:
            </p>
            <ul className="border border-white/10 rounded max-w-lg mx-auto">
              {content.error.filePaths.map((path) => (
                <li
                  key={path}
                  className="border-b border-white/10 last:border-none"
                >
                  /docs{path}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Footer />
        <Toolbar />
      </>
    );
  }

  if (content.data) {
    return (
      <PageContext.Provider
        value={{
          path: ensureLeadingSlash(path),
          bundle: content.data,
          preview: true,
          getFile,
        }}
      >
        <DocumentationLayout />
        <Toolbar />
      </PageContext.Provider>
    );
  }

  return (
    <Site>
      <Header />
      <section className="max-w-5xl w-full mx-auto py-20 px-6">
        <div>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl !leading-[45px] lg:!leading-[65px] font-bold text-center text-brand-50 drop-shadow-md">
              Local Preview
            </h1>
            <h2 className="text-brand-100 text-center">
              Live preview your local documentation in real-time directly in the
              browser.
            </h2>
            <div className="flex justify-center mt-6">
              {client ? <Trigger /> : null}
            </div>
          </div>
        </div>
        <div className="text-center mt-12 opacity-75">
          Need to get started with docs.page?
          <br />
          <Link href="/get-started" className="underline">
            Check out the getting started guide
          </Link>
          .
        </div>
      </section>
      <Footer />
    </Site>
  );
}

function Trigger() {
  const { state, error } = useTrigger();
  const selectDirectory = useSelectDirectory();
  const requestPermissions = useRequestPermissions();
  const restart = useRestart();

  if (state === "UNSUPPORTED") {
    return (
      <p className="text-red-500 text-center">
        Your browser does not support the required features to preview
        directories. <br /> Please check the browser{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://caniuse.com/?search=showDirectoryPicker"
          className="underline"
        >
          compatibility table
        </a>
        .
      </p>
    );
  }

  if (state === "PERMISSION_REQUIRED") {
    return (
      <div className="space-y-6 flex flex-col justify-center items-center">
        {error?.message ? (
          <p className="text-red-500">
            Please grant read access to the local "{error!.message}" directory
            to continue, or{" "}
            <button
              className="underline"
              type="button"
              onClick={() => {
                restart.mutate();
              }}
            >
              start over
            </button>
            .
          </p>
        ) : null}
        <Button
          element="button"
          type="button"
          cta
          onClick={() => {
            requestPermissions.mutate();
          }}
        >
          Grant Read Permission
        </Button>
      </div>
    );
  }

  const disabled = state === "LOADING" || state === "PREPARING";

  return (
    <Button
      cta
      element="button"
      disabled={disabled}
      className={cn({
        "opacity-50": disabled,
      })}
      onClick={() => {
        if (disabled) {
          return;
        }

        selectDirectory.mutate();
      }}
    >
      Select Directory
    </Button>
  );
}
