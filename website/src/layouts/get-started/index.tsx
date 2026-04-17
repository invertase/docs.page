import {
  BookIcon,
  CheckIcon,
  ClipboardIcon,
  ExternalLinkIcon,
  EyeIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { LINKS } from "~/constants/links";
import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { Site } from "../Site";
import { Card } from "./Card";

/** Desktop: intrinsic width + right-align with CTAs; mobile: full width of column. */
const assetImgClassName = "h-auto w-full max-w-full lg:w-auto";

export default function GetStartedRoute() {
  return (
    <Site>
      <div className="homepage-spot-grid min-h-screen">
        <Header />
        <section className="mx-auto w-full max-w-5xl px-6 py-20">
          <div>
            <h1 className="heading-h1 text-center">
              Publish docs in{" "}
              <span className="font-mono text-marketing-accent-bright dark:text-marketing-accent-emphasis">
                four
              </span>{" "}
              steps
            </h1>
            <div className="relative mx-auto mt-12 max-w-[800px] space-y-6">
              <Install />
              <PreviewDocs />
              <AddContent />
              <PublishChanges />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </Site>
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
          src="/_docs.page/assets/get-started/install/install.png"
          alt="Install docs.page with the CLI"
          className={assetImgClassName}
        />
      }
      meta={
        <p>
          Run the{" "}
          <a href={`${LINKS.docs}/cli/commands/init`} className="underline">
            CLI init
          </a>{" "}
          command in your project to add docs.page to your project.
        </p>
      }
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText("npx @docs.page/cli init");
          setCopied(true);
        }}
      >
        {copied ? (
          <>
            <CheckIcon
              size={16}
              className="text-marketing-success dark:text-marketing-success-bright"
            />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <ClipboardIcon size={16} />
            <span>Copy Command</span>
          </>
        )}
      </Button>
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
          src="/_docs.page/assets/get-started/add-content-editor.png"
          alt="Markdown"
          className={assetImgClassName}
        />
      }
      meta={
        <p>
          <a href={`${LINKS.docs}/writing-content`} className="  underline">
            Write your documentation
          </a>{" "}
          using Markdown, adding new pages to your `docs` directory.
        </p>
      }
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          window.location.href = `${LINKS.docs}/writing-content`;
        }}
      >
        <BookIcon size={16} />
        <span>Read Guide</span>
      </Button>
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
          src="/_docs.page/assets/get-started/preview-docs.png"
          alt="Markdown"
          className={assetImgClassName}
        />
      }
      meta={
        <p>
          View your documentation locally before publishing it to the web using{" "}
          <Link href="/preview" className="underline">
            Local Preview
          </Link>{" "}
          mode.
        </p>
      }
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          window.location.href = "/preview";
        }}
      >
        <EyeIcon size={16} />
        <span>Local Preview</span>
      </Button>
    </Card>
  );
}

function PublishChanges() {
  const [input, setInput] = useState("");

  const match = input.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/);

  const isInvalid = !!input && !match;

  return (
    <Card
      isLast
      step={4}
      title="Publish Changes"
      description="Make your changes public"
      asset={
        <img
          src="/_docs.page/assets/get-started/publish.png"
          alt="Markdown"
          className={assetImgClassName}
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
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                type="text"
                value={input}
                placeholder="https://github.com/org/repo"
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="mt-1 text-xs text-destructive">
                {isInvalid ? "Enter a valid GitHub repository URL" : null}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="shrink-0"
              disabled={!input || isInvalid}
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
            </Button>
          </div>
        </div>
      }
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          window.location.href = `${LINKS.docs}/publishing`;
        }}
      >
        <ExternalLinkIcon size={16} />
        <span>Visit Docs</span>
      </Button>
    </Card>
  );
}
