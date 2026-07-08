import { docsHtmlSchema } from "@docs.page/mdx-bundler";
import type { ComponentProps } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Heading, type HeadingTag } from "@/components/mdx/heading";
import { Image } from "@/components/mdx/image";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getAssetSrc } from "@/lib/docs-assets";
import { cn } from "@/lib/utils";
import { Link } from "./doc-link";

type MarkdownLeafProps = {
  source: string;
  takeNextHeadingId: () => string | undefined;
  /** Raw HTML blocks (e.g. author layout tables) need compact cells and inline images. */
  htmlLayout?: boolean;
};

/** Markdown wraps images in <p>; our Image uses <figure>, which must not sit inside <p>. */
function hastSubtreeHasTag(node: unknown, tagName: string): boolean {
  if (!node || typeof node !== "object") {
    return false;
  }
  const n = node as { type?: string; tagName?: string; children?: unknown[] };
  if (n.type === "element" && n.tagName === tagName) {
    return true;
  }
  for (const child of n.children ?? []) {
    if (hastSubtreeHasTag(child, tagName)) {
      return true;
    }
  }
  return false;
}

function compactTableImage(
  props: ComponentProps<"img">,
  resolveSrc: (src: string) => string,
) {
  const { width, height, className, alt, src, ...other } = props;
  const resolvedSrc = src ? resolveSrc(String(src)) : undefined;

  return (
    <img
      {...other}
      alt={alt ?? ""}
      src={resolvedSrc}
      loading="lazy"
      className={cn("rounded-lg", className)}
      style={{
        width: width ? Number.parseInt(String(width), 10) : undefined,
        height: height ? Number.parseInt(String(height), 10) : undefined,
      }}
    />
  );
}

export function MarkdownLeaf({
  source,
  takeNextHeadingId,
  htmlLayout = false,
}: MarkdownLeafProps) {
  const { bundle } = useDocPageContext();
  const components: Components = {
    h1: (props) => renderHeading("h1", props, takeNextHeadingId),
    h2: (props) => renderHeading("h2", props, takeNextHeadingId),
    h3: (props) => renderHeading("h3", props, takeNextHeadingId),
    h4: (props) => renderHeading("h4", props, takeNextHeadingId),
    h5: (props) => renderHeading("h5", props, takeNextHeadingId),
    h6: (props) => renderHeading("h6", props, takeNextHeadingId),
    p: ({ node, className, ...props }) => {
      const useDiv = hastSubtreeHasTag(node, "img");
      const Tag = useDiv ? "div" : "p";
      return (
        <Tag className={cn("leading-7 opacity-90", className)} {...props} />
      );
    },
    a: ({ node, className, children, ...props }) => {
      const wrapsImage = htmlLayout && hastSubtreeHasTag(node, "img");

      return (
        <Link
          href={props.href ?? "/"}
          className={cn(
            wrapsImage
              ? "inline-block transition-opacity hover:opacity-80"
              : "font-medium underline decoration-primary underline-offset-4 hover:opacity-80 transition-opacity",
            className,
          )}
          {...props}
        >
          {children}
        </Link>
      );
    },
    strong: ({ node: _node, className, ...props }) => (
      <strong
        className={cn("font-semibold text-foreground", className)}
        {...props}
      />
    ),
    em: ({ node: _node, className, ...props }) => (
      <em className={cn("italic", className)} {...props} />
    ),
    ul: ({ node: _node, className, ...props }) => (
      <ul
        className={cn("my-4 ms-6 list-disc space-y-2", className)}
        {...props}
      />
    ),
    ol: ({ node: _node, className, ...props }) => (
      <ol
        className={cn("my-4 ms-6 list-decimal space-y-2", className)}
        {...props}
      />
    ),
    li: ({ node: _node, className, ...props }) => (
      <li className={cn("leading-7 ps-1", className)} {...props} />
    ),
    blockquote: ({ node: _node, className, ...props }) => (
      <blockquote
        className={cn(
          "my-6 border-s-2 border-border ps-4 text-muted-foreground",
          className,
        )}
        {...props}
      />
    ),
    code: ({ node: _node, className, ...props }) => (
      <code
        className={cn(
          "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground",
          className,
        )}
        {...props}
      />
    ),
    pre: ({ node: _node, className, ...props }) => (
      <pre
        className={cn(
          "my-4 overflow-x-auto rounded-lg border bg-card p-4 font-mono text-sm",
          className,
        )}
        {...props}
      />
    ),
    table: ({ node: _node, className, ...props }) => (
      <div
        className={cn(
          "my-6 overflow-x-auto",
          htmlLayout ? undefined : "rounded-lg border",
        )}
      >
        <table
          className={cn(
            "border-collapse",
            htmlLayout ? "table-auto" : "w-full text-sm",
            className,
          )}
          {...props}
        />
      </div>
    ),
    thead: ({ node: _node, className, ...props }) => (
      <thead className={cn("bg-muted/60", className)} {...props} />
    ),
    tr: ({ node: _node, className, ...props }) => (
      <tr className={cn("border-b last:border-b-0", className)} {...props} />
    ),
    th: ({ node: _node, className, ...props }) => (
      <th
        className={cn(
          "px-4 py-3 text-left font-medium text-foreground",
          className,
        )}
        {...props}
      />
    ),
    td: ({ node: _node, className, ...props }) => (
      <td
        className={cn(
          htmlLayout ? "p-0.5 align-top" : "px-4 py-3 align-top",
          className,
        )}
        {...props}
      />
    ),
    hr: ({ node: _node, className, ...props }) => (
      <hr className={cn("my-8 border-border", className)} {...props} />
    ),
    img: ({ node: _node, ...props }) =>
      htmlLayout ? (
        compactTableImage(props, (src) => getAssetSrc(bundle, src))
      ) : (
        <Image {...props} />
      ),
  };

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, docsHtmlSchema]]}
    >
      {source}
    </ReactMarkdown>
  );
}

function renderHeading(
  tag: HeadingTag,
  props: ComponentProps<HeadingTag>,
  takeNextHeadingId: () => string | undefined,
) {
  return <Heading {...props} id={takeNextHeadingId()} type={tag} />;
}
