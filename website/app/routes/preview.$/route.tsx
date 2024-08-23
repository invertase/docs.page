import { NavLink, redirect, useFetcher, useParams } from "@remix-run/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ActionFunctionArgs, MetaFunction } from "@vercel/remix";
import { useEffect, useState } from "react";
import { getPreviewBundle } from "../../api";
import { useTrigger } from "./trigger";
import {
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
import { useInlineScript } from "~/hooks";
import { DocsLayout } from "~/layouts/DocsLayout";
import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { getMetadata } from "~/meta";
import { cn, ensureLeadingSlash, isExternalLink } from "~/utils";
import { Toolbar } from "./Toolbar";

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

  const scripts = useInlineScript(`<script>(() => {
		document.documentElement.setAttribute('data-theme', 'dark');
    const root = document.documentElement;
		root.style.setProperty('--background-dark', '224, 71%, 4%');		
	})()</script>`);

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
      {scripts}
      <Header />
      <section className="max-w-5xl w-full mx-auto py-20 px-6">
        <div>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl !leading-[45px] lg:!leading-[65px] font-bold text-center text-brand-50 drop-shadow-md">
              Live Preview
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
