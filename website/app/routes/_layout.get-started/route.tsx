import { type ComponentProps, useEffect, useState } from "react";

import { NavLink } from "@remix-run/react";
import {
  BookIcon,
  CheckIcon,
  ClipboardIcon,
  ExternalLinkIcon,
  EyeIcon,
} from "lucide-react";
import { useInlineScript } from "~/hooks";
import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { getLinkDescriptors, getMetadata } from "~/meta";
import { cn } from "~/utils";
import { Card } from "./Card";

export const links = getLinkDescriptors;
export const meta = getMetadata;

export default function GetStartedRoute() {
  const scripts = useInlineScript(`<script>(() => {
		document.documentElement.setAttribute('data-theme', 'dark');
    const root = document.documentElement;
		root.style.setProperty('--background-dark', '224, 71%, 4%');		
	})()</script>`);

  return (
    <>
      {scripts}
      <Header />
      <section className="max-w-5xl w-full mx-auto py-20 px-6">
        <div className="">
          <h1 className="text-center text-5xl font-semibold leading-[55px] bg-clip-text text-transparent bg-gradient-to-b from-brand-50 to-brand-100">
            Publish docs in 4 steps
          </h1>
          <div className="relative max-w-[800px] space-y-6 mx-auto mt-12">
            <div className="hidden lg:block absolute w-px bg-gradient-to-b top-10 from-brand-100/50 via-brand-100/50 bottom-0 h-full -left-8" />
            <Install />
            <PreviewDocs />
            <AddContent />
            <PublishChanges />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Install() {
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
      title="Install"
      description="Add docs.page to your project"
      asset={
        <img
          src="/assets/get-started/terminal.png"
          alt="Terminal Command"
          className=""
        />
      }
      meta={
        <p>
          Run the{" "}
          <a
            href="https://use.docs.page/cli/commands/init"
            className="underline"
          >
            CLI init
          </a>{" "}
          command in your project to add docs.page to your project.
        </p>
      }
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
      step={3}
      title="Add Content"
      description="Add markdown to a page"
      asset={
        <img
          src="/assets/get-started/add-content-editor.png"
          alt="Markdown"
          className="w-full"
        />
      }
      meta={
        <p>
          <a
            href="https://use.docs.page/writing-content"
            className="  underline"
          >
            Write your documentation
          </a>{" "}
          using Markdown, adding new pages to your `docs` directory.
        </p>
      }
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
      step={2}
      title="Preview Docs"
      description="Preview your docs.page site"
      asset={
        <img
          src="/assets/get-started/preview.png"
          alt="Markdown"
          className="w-full"
        />
      }
      meta={
        <p>
          View your documentation locally before publishing it to the web using{" "}
          <NavLink to="/preview" className="underline">
            Local Preview
          </NavLink>{" "}
          mode.
        </p>
      }
    >
      <ActionButton
        onClick={() => {
          window.location.href = "/preview";
        }}
      >
        <EyeIcon size={16} />
        <span>Local Preview</span>
      </ActionButton>
    </Card>
  );
}

function PublishChanges() {
  const [input, setInput] = useState("");

  const match = input.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)$/);

  const isInvalid = !!input && !match;

  return (
    <Card
      step={4}
      title="Publish Changes"
      description="Make your changes public"
      asset={
        <img
          src="/assets/get-started/publish.png"
          alt="Markdown"
          className="w-full"
        />
      }
      meta={
        <div className="space-y-3">
          <p>
            Push your changes to your GitHub repository to publish your
            docs.page website to the public web.
          </p>
          <p>
            Enter your GitHub repository URL below to visit your docs.page
            website.
          </p>
          <div className="flex items-start gap-2">
            <div className="grow">
              <input
                className="w-full border border-white/10 rounded-md px-3 py-2 bg-gradient-to-br from-brand-900/90 to-black text-white"
                type="text"
                value={input}
                placeholder="https://github.com/org/repo"
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="text-xs mt-1 text-red-500">
                {isInvalid ? "Enter a valid GitHub repository URL" : null}
              </div>
            </div>
            <button
              type="button"
              className={cn(
                "bg-white hover:bg-white/90 size-9 rounded flex items-center justify-center text-black",
                {
                  "opacity-50 cursor-not-allowed": !input || isInvalid,
                },
              )}
              onClick={() => {
                if (!input || isInvalid) {
                  return;
                }

                window.location.href = `https://docs.page/${match![1]}/${
                  match![2]
                }`;
              }}
            >
              <ExternalLinkIcon size={16} />
            </button>
          </div>
        </div>
      }
    >
      <ActionButton
        onClick={() => {
          window.location.href = "https://use.docs.page/publishing";
        }}
      >
        <ExternalLinkIcon size={16} />
        <span>Vist Docs</span>
      </ActionButton>
    </Card>
  );
}

function ActionButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "inline-flex items-center gap-2 bg-brand-50 hover:bg-brand-50/90 transition-all text-black px-3 py-2 font-medium rounded-md",
        className,
      )}
    />
  );
}
