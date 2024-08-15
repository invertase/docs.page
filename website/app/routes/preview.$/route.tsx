import { redirect, useFetcher, useParams } from "@remix-run/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ActionFunctionArgs, MetaFunction } from "@vercel/remix";
import { useEffect, useState } from "react";
import { PreviewLayout } from "./PreviewLayout";
import { getPreviewBundle } from "../../api";
import {
  getFile,
  queryClient,
  useDirectoryHandle,
  usePageContent,
} from "./utils";

import docsearch from "@docsearch/css/dist/style.css?url";
import { ensureLeadingSlash, isExternalLink } from "~/utils";
import { Header } from "~/layouts/Header";
import { useInlineScript } from "~/hooks";
import { DocsLayout } from "~/layouts/DocsLayout";
import { Toolbar } from "./Toolbar";
import { PageContext } from "~/context";
import { HeroGradient } from "~/layouts/HeroGradient";

export const meta: MetaFunction = () => {
  return [
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
      <div className="absolute inset-0 z-[-1]">
        <HeroGradient />
      </div>
      <section className="max-w-5xl w-full mx-auto pt-20 px-6">
        <div className="flex items-center">
          <div>
            <h1 className="text-4xl !leading-[45px] md:!leading-[65px] lg:!leading-[80px] font-bold  text-brand-50 drop-shadow-md">
              Live Preview
            </h1>
            <h2 className="text-brand-100">
              Live preview your local documentation in real-time.
            </h2>
          </div>
          <div className="grow flex items-end justify-end w-12">
            {client ? <PreviewLayout /> : null}
          </div>
        </div>
      </section>
    </>
  );
}
