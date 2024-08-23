import { redirect, useFetcher, useNavigate, useParams } from "@remix-run/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ActionFunctionArgs, MetaFunction } from "@vercel/remix";
import { type ComponentProps, useEffect, useState } from "react";
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
import { PageContext } from "~/context";
import { useInlineScript } from "~/hooks";
import { DocsLayout } from "~/layouts/DocsLayout";
import { Header } from "~/layouts/Header";
import { HeroGradient } from "~/layouts/HeroGradient";
import { getMetadata } from "~/meta";
import { cn, ensureLeadingSlash, isExternalLink } from "~/utils";
import { Toolbar } from "./Toolbar";
import { BookIcon, CheckIcon, ClipboardIcon } from "lucide-react";
import { Button } from "~/components/Button";

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
        <div className="mt-12">
          <h2 className="text-center text-3xl font-semibold leading-[55px] bg-clip-text text-transparent bg-gradient-to-b from-brand-50 to-brand-100">
            Publish docs in 4 steps
          </h2>
          <div className="relative max-w-[800px] space-y-6 mx-auto mt-12">
            <div className="hidden lg:block absolute w-px bg-gradient-to-b top-10 from-brand-100/50 via-brand-100/50 to-black bottom-0 h-full -left-8" />
            <GetStarted />
            <AddContent />
            <PreviewDocs />
            <PublishChanges />
          </div>
        </div>
      </section>
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

function GetStarted() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <Card
      step={1}
      title="Get Started"
      description="Add docs.page to your project"
      asset={<img src="/assets/preview/terminal.png" alt="Terminal Command" />}
    >
      <ActionButton
        onClick={() => {
          navigator.clipboard.writeText("npx @docs.page/cli init");
          setCopied(true);
        }}
      >
        {copied ? (
          <>
            <CheckIcon size={16} className="text-green-500" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <ClipboardIcon size={16} />
            <span>Copy Command</span>
          </>
        )}
      </ActionButton>
    </Card>
  );
}

function AddContent() {
  return (
    <Card
      step={2}
      title="Add Content"
      description="Add markdown to a page"
      asset={<img src="/assets/preview/add-content.png" alt="Markdown" />}
    >
      <ActionButton
        onClick={() => {
          window.location.href = "https://use.docs.page/writing-content";
        }}
      >
        <BookIcon size={16} />
        <span>Read Guide</span>
      </ActionButton>
    </Card>
  );
}

function PreviewDocs() {
  return (
    <Card
      step={3}
      title="Preview Docs"
      description="Preview your docs.page site"
      asset={<img src="/assets/preview/add-content.png" alt="Markdown" />}
    >
      <ActionButton
        onClick={() => {
          window.location.href = "https://use.docs.page/writing-content";
        }}
      >
        <BookIcon size={16} />
        <span>Read Guide</span>
      </ActionButton>
    </Card>
  );
}

function PublishChanges() {
  return (
    <Card
      step={4}
      title="Publish Changes"
      description="Make your changes public"
      asset={<img src="/assets/preview/add-content.png" alt="Markdown" />}
    >
      <ActionButton
        onClick={() => {
          window.location.href = "https://use.docs.page/writing-content";
        }}
      >
        <BookIcon size={16} />
        <span>Vist Site</span>
      </ActionButton>
    </Card>
  );
}

type Props = {
  step: number;
  title: string;
  description: string;
  asset: React.ReactNode;
  children: React.ReactNode;
};

function Card(props: Props) {
  return (
    <div className="relative">
      <div className="hidden lg:flex absolute -left-[60px] top-4 bg-gradient-to-br from-brand-900/90 to-black border border-brand-100/20 text-brand-50 rounded-full size-14 text-2xl items-center justify-center font-bold">
        {props.step}
      </div>
      <div className="bg-black rounded-xl p-6 lg:ml-8 grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <h2 className="font-semibold text-2xl text-brand-50">
            <span className="lg:hidden">{props.step}. </span>
            <span>{props.title}</span>
          </h2>
          <p className="mt-1 mb-6 opacity-75">{props.description}</p>
          <div className="lg:hidden">{props.asset}</div>
          <div className="mt-10">{props.children}</div>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <div>{props.asset}</div>
        </div>
      </div>
    </div>
  );
}

function ActionButton(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      type="button"
      className="inline-flex items-center gap-2 bg-white text-black px-3 py-2 font-medium rounded-md"
    />
  );
}
