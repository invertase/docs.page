import { NavLink, redirect, useFetcher, useParams } from "@remix-run/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ActionFunctionArgs, MetaFunction } from "@vercel/remix";
import { useEffect, useState } from "react";
import { getPreviewBundle } from "../../api";
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

import docsearch from "@docsearch/css/dist/style.css?url";
import { Button } from "~/components/Button";
import { PageContext } from "~/context";
import { DocsLayout } from "~/layouts/DocsLayout";
import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { getLinkDescriptors, getMetadata } from "~/meta";
import { cn, ensureLeadingSlash, isExternalLink } from "~/utils";
import { Toolbar } from "./Toolbar";

export const links = getLinkDescriptors;

export const meta: MetaFunction = () => {
  return [
    ...getMetadata(),
    {
      tagName: "link",
      rel: "stylesheet",
      href: docsearch,
    },
  ];
};

export default function PreviewOutlet() {
  return (
    <QueryClientProvider client={queryClient}>
      <Preview />
    </QueryClientProvider>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const json = await args.request.json();
  const bundle = await getPreviewBundle(json).catch((response) => {
    throw response;
  });

  // Check if the user has set a redirect in the frontmatter of this page.
  const redirectTo =
    typeof bundle.frontmatter.redirect === "string"
      ? bundle.frontmatter.redirect
      : undefined;

  // Redirect to the specified URL.
  if (redirectTo && redirectTo.length > 0) {
    const url = isExternalLink(String(redirectTo))
      ? String(redirectTo)
      : `/preview${ensureLeadingSlash(String(redirectTo))}`;

    throw redirect(url);
  }

  return {
    bundle,
  };
};

function Preview() {
  const [client, setClient] = useState(false);
  const params = useParams();
  const path = params["*"] || "";

  const fetcher = useFetcher<typeof action>({ key: "bundle" });
  const directory = useDirectoryHandle();
  const content = usePageContent(path, directory.data);
  const bundle = fetcher.data?.bundle;

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    if (content.data) {
      console.log("Submitting content", content.data);
      fetcher.submit(content.data, {
        method: "POST",
        encType: "application/json",
      });
    }
  }, [fetcher.submit, content.data]);

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

  if (bundle && directory.data) {
    return (
      <PageContext.Provider
        value={{
          path: ensureLeadingSlash(path),
          bundle,
          preview: true,
          getFile,
        }}
      >
        <DocsLayout />
        <Toolbar />
      </PageContext.Provider>
    );
  }

  return (
    <>
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
          <NavLink to="/get-started" className="underline">
            Check out the getting started guide
          </NavLink>
          .
        </div>
      </section>
      <Footer />
    </>
  );
}

function Trigger() {
  const { state, error } = useTrigger();
  const selectDirectory = useSelectDirectory();
  const requestPermissions = useRequestPermissions();
  const restart = useRestart();

  console.log(state, error);

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
          as="button"
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
      as="button"
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
