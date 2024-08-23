import type { MetaFunction } from "@vercel/remix";
import { type ComponentProps, useEffect, useState } from "react";

import docsearch from "@docsearch/css/dist/style.css?url";
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
import { getMetadata } from "~/meta";
import { cn } from "~/utils";
import { Card } from "./Card";

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
            <div className="hidden lg:block absolute w-px bg-gradient-to-b top-10 from-brand-100/50 via-brand-100/50 to-black bottom-0 h-full -left-8" />
            <Install />
            <AddContent />
            <PreviewDocs />
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
          window.location.href = "/preview";
        }}
      >
        <EyeIcon size={16} />
        <span>Preview</span>
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
      asset={<img src="/assets/preview/add-content.png" alt="Markdown" />}
    >
      <div>
        <input
          className="border border-white rounded-full px-3 py-1"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div>{isInvalid ? "Invalid URL" : null}</div>
      </div>

      <ActionButton
        disabled={!input || isInvalid}
        className={cn({
          "opacity-50": !input || isInvalid,
        })}
        onClick={() => {
          if (!input || isInvalid) {
            return;
          }

          window.location.href = `https://docs.page/${match![1]}/${match![2]}`;
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
        "inline-flex items-center gap-2 bg-white text-black px-3 py-2 font-medium rounded-md",
        className,
      )}
    />
  );
}
