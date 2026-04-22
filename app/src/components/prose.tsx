import { code } from "@streamdown/code";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { decodeComponentProps, normalizeCustomTags } from "@/lib/docs-markdown";
import { cn } from "@/lib/utils";
import { Streamdown } from "streamdown";
import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { components } from "./mdx";
import { Heading, HeadingTag, HeadingTagProps } from "./mdx/heading";

type StreamdownComponents = NonNullable<
  ComponentProps<typeof Streamdown>["components"]
>;
type MarkdownBlockProps = {
  markdown: string;
  takeNextHeadingId: () => string | undefined;
};
type CustomDivProps = ComponentProps<"div"> & {
  "data-component"?: string;
  "data-name"?: string;
  "data-props"?: string;
};
type DocComponentProps = ComponentProps<"div"> &
  Record<string, unknown> & {
    markdown?: string;
    children?: ReactNode;
  };
type DocComponent = (props: DocComponentProps) => ReactNode;

const DOC_COMPONENTS = components as unknown as Record<string, DocComponent>;
const DOC_COMPONENT_NAMES = Object.keys(DOC_COMPONENTS);

export function Prose() {
  const { bundle } = useDocPageContext();
  const headingIds = useMemo(
    () => bundle.headings.map((heading) => heading.id),
    [bundle.headings],
  );
  const headingIndexRef = useRef(0);

  headingIndexRef.current = 0;

  const takeNextHeadingId = useCallback(() => {
    const id = headingIds[headingIndexRef.current];
    headingIndexRef.current += 1;
    return id;
  }, [headingIds]);

  return (
    <main className="max-w-none">
      <MarkdownBlock
        markdown={bundle.markdown}
        takeNextHeadingId={takeNextHeadingId}
      />
    </main>
  );
}

function MarkdownBlock({ markdown, takeNextHeadingId }: MarkdownBlockProps) {
  const normalizedMarkdown = useMemo(
    () => normalizeCustomTags(markdown, DOC_COMPONENT_NAMES),
    [markdown],
  );
  const streamdownComponents = useMemo(
    () => createStreamdownComponents(takeNextHeadingId),
    [takeNextHeadingId],
  );

  return (
    <Streamdown
      allowedTags={{
        div: ["data*"],
      }}
      plugins={{ code }}
      components={streamdownComponents}
      linkSafety={{ enabled: false }}
      controls={{
        code: {
          download: false,
        }
      }}
      className="space-y-4 text-secondary-foreground"
    >
      {normalizedMarkdown}
    </Streamdown>
  );
}

function createStreamdownComponents(
  takeNextHeadingId: () => string | undefined,
): StreamdownComponents {
  const renderHeading = (
    tag: HeadingTag,
    props: ComponentProps<HeadingTag>,
  ) => {
    const id = takeNextHeadingId();
    return <Heading {...props} id={id} type={tag} />;
  };

  const renderNestedMarkdown = (markdown: string) => (
    <MarkdownBlock markdown={markdown} takeNextHeadingId={takeNextHeadingId} />
  );

  return {
    h1: (props) => renderHeading("h1", props),
    h2: (props) => renderHeading("h2", props),
    h3: (props) => renderHeading("h3", props),
    h4: (props) => renderHeading("h4", props),
    h5: (props) => renderHeading("h5", props),
    h6: (props) => renderHeading("h6", props),
    p: ({ children }) => <p className="leading-7 opacity-80">{children}</p>,
    inlineCode: ({ children }) => (
      <code className="bg-primary/5 rounded border font-mono text-sm px-1 py-1">
        {children}
      </code>
    ),
    div: ({ children, ...props }) => {
      const {
        "data-component": dataComponent,
        "data-name": dataName,
        "data-props": encodedProps,
        className,
        ...divProps
      } = props as CustomDivProps;

      if (!dataComponent) {
        return (
          <div className={className} {...divProps}>
            {children}
          </div>
        );
      }

      const markdown = extractTextContent(children).trim();
      const renderedChildren = markdown
        ? renderNestedMarkdown(markdown)
        : children;
      const decodedProps = decodeComponentProps(encodedProps);
      const Component = DOC_COMPONENTS[dataComponent];

      if (Component) {
        return (
          <Component
            className={className}
            markdown={markdown}
            {...divProps}
            {...decodedProps}
          >
            {renderedChildren}
          </Component>
        );
      }

      return (
        <div
          className={cn(
            "rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950",
            className,
          )}
          {...divProps}
        >
          <div className="text-sm font-medium">
            Unknown component: {dataName ?? dataComponent}
          </div>
          {Object.keys(decodedProps).length > 0 ? (
            <pre className="mt-2 overflow-x-auto text-xs opacity-75">
              {JSON.stringify(decodedProps, null, 2)}
            </pre>
          ) : null}
          {renderedChildren ? (
            <div className="mt-3">{renderedChildren}</div>
          ) : null}
        </div>
      );
    },
  };
}

function extractTextContent(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement(child)) {
        return extractTextContent(
          (child.props as { children?: ReactNode }).children ?? "",
        );
      }

      return "";
    })
    .join("");
}
