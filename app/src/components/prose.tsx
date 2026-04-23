import { code } from "@streamdown/code";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { normalizeCustomTags } from "@/lib/docs-markdown";
import { Streamdown } from "streamdown";
import {
  Children,
  type ComponentProps,
  Fragment,
  isValidElement,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Heading, type HeadingTag } from "./mdx/heading";
import { Tabs, TabsProvider } from "./mdx/tabs";
import { Info, Success, Warning, Error } from "./mdx/callout";

const COMPONENTS = {
  info: [],
  warning: [],
  error: [],
  success: [],
  tabs: ["groupid", "defaultvalue"],
  tabitem: [],
  unknown: ["data*"],
};

type StreamdownComponents = NonNullable<
  ComponentProps<typeof Streamdown>["components"]
>;

type MarkdownBlockProps = {
  markdown: string;
  takeNextHeadingId: () => string | undefined;
};

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
      <TabsProvider>
        <MarkdownBlock
          markdown={bundle.markdown}
          takeNextHeadingId={takeNextHeadingId}
        />
      </TabsProvider>
    </main>
  );
}

function MarkdownBlock({ markdown, takeNextHeadingId }: MarkdownBlockProps) {
  const normalizedMarkdown = useMemo(
    () => normalizeCustomTags(markdown, Object.keys(COMPONENTS)),
    [markdown],
  );
  const streamdownComponents = useMemo(
    () => createStreamdownComponents(takeNextHeadingId),
    [takeNextHeadingId],
  );

  return (
    <Streamdown
      allowedTags={COMPONENTS}
      plugins={{ code }}
      components={streamdownComponents}
      linkSafety={{ enabled: false }}
      controls={{
        code: {
          download: false,
        },
      }}
      className="space-y-4 text-secondary-foreground [&>p]:leading-7 [&>p]:opacity-90"
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
    info: ({ children }) => (
      <Info>
        {renderComponentChildren(children as ReactNode, renderNestedMarkdown)}
      </Info>
    ),
    warning: ({ children }) => (
      <Warning>
        {renderComponentChildren(children as ReactNode, renderNestedMarkdown)}
      </Warning>
    ),
    error: ({ children }) => (
      <Error>
        {renderComponentChildren(children as ReactNode, renderNestedMarkdown)}
      </Error>
    ),
    success: ({ children }) => (
      <Success>
        {renderComponentChildren(children as ReactNode, renderNestedMarkdown)}
      </Success>
    ),
    tabs: ({ children, ...props }) => {
      return (
        <Tabs
          node={props.node}
          groupId={propValue(props, "groupid")}
          defaultValue={propValue(props, "defaultvalue")}
        >
          {renderComponentChildren(children as ReactNode, renderNestedMarkdown)}
        </Tabs>
      );
    },
    tabitem: ({ children }) =>
      renderComponentChildren(children as ReactNode, renderNestedMarkdown),
    image: ({ children }) => <div>IMAGE{children}</div>,
    unknown: (props) => (
      <div className="bg-destructive/80 text-white border border-destructive/50 rounded p-4 space-y-2">
        <p>
          Markdown contains an unknown component which could not be rendered:
        </p>
        <p>
          <code>{`<${propValue<string>(props, "data-name")} />`}</code>
        </p>
      </div>
    ),
    // div: (props) => {
    //   const componentName = getCustomComponentName(props.node);
    //   const Component = componentName ? DOC_COMPONENTS[componentName] : null;

    //   // If the component is a known component, render it.
    //   if (Component) {
    //     const componentProps = getCustomComponentProps(props.node, componentName!) ?? {};
    //     const renderedChildren = componentName === "tabs"
    //       ? renderTabsChildren(props.children, renderNestedMarkdown)
    //       : renderComponentChildren(props.children, renderNestedMarkdown);

    //     return (
    //       <Component {...componentProps} node={props.node}>
    //         {renderedChildren}
    //       </Component>
    //     );
    //   }

    //   return <div>NOOP</div>;
    // },
    //   inlineCode: ({ children }) => (
    //     <code className="bg-primary/5 rounded border font-mono text-sm px-1 py-1">
    //       {children}
    //     </code>
    //   ),
    //   div: ({ children, ...props }) => {
    //     const {
    //       "data-component": dataComponent,
    //       "data-name": dataName,
    //       "data-props": encodedProps,
    //       className,
    //       ...divProps
    //     } = props as CustomDivProps;

    //     if (!dataComponent) {
    //       return (
    //         <div className={className} {...divProps}>
    //           {children}
    //         </div>
    //       );
    //     }

    //     const markdown = extractTextContent(children).trim();
    //     const renderedChildren = markdown
    //       ? renderNestedMarkdown(markdown)
    //       : children;
    //     const decodedProps = decodeComponentProps(encodedProps);
    //     const Component = DOC_COMPONENTS[dataComponent];

    //     if (Component) {
    //       return (
    //         <Component
    //           className={className}
    //           markdown={markdown}
    //           {...divProps}
    //           {...decodedProps}
    //         >
    //           {renderedChildren}
    //         </Component>
    //       );
    //     }

    //     return (
    //       <div
    //         className={cn(
    //           "rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950",
    //           className,
    //         )}
    //         {...divProps}
    //       >
    //         <div className="text-sm font-medium">
    //           Unknown component: {dataName ?? dataComponent}
    //         </div>
    //         {Object.keys(decodedProps).length > 0 ? (
    //           <pre className="mt-2 overflow-x-auto text-xs opacity-75">
    //             {JSON.stringify(decodedProps, null, 2)}
    //           </pre>
    //         ) : null}
    //         {renderedChildren ? (
    //           <div className="mt-3">{renderedChildren}</div>
    //         ) : null}
    //       </div>
    //     );
    //   },
  } satisfies StreamdownComponents;
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

function propValue<T>(
  props: Record<string, unknown>,
  key: string,
): T | undefined {
  return props[key] as T | undefined;
}

function extractTextOnlyContent(children: ReactNode): string {
  const childNodes = Children.toArray(children);

  if (childNodes.some((child) => isValidElement(child))) {
    return "";
  }

  return childNodes
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : "",
    )
    .join("");
}

function renderComponentChildren(
  children: ReactNode,
  renderNestedMarkdown: (markdown: string) => ReactNode,
): ReactNode {
  const childNodes = Children.toArray(children);
  const hasSerializedCustomComponents = childNodes.some(
    (child) => typeof child === "string" && child.includes('data-component="'),
  );

  // When streamdown yields a mix of rendered elements + serialized custom-component
  // HTML in strings, re-parse only the string chunks to recover nested components.
  if (hasSerializedCustomComponents) {
    return childNodes.map((child, index) => {
      if (typeof child !== "string") {
        return child;
      }

      const markdown = normalizeNestedMarkdown(child);
      if (!markdown) {
        return null;
      }

      return (
        <Fragment key={`nested-markdown-${index}`}>
          {renderNestedMarkdown(markdown)}
        </Fragment>
      );
    });
  }

  const markdown = normalizeNestedMarkdown(extractTextOnlyContent(children));
  return markdown ? renderNestedMarkdown(markdown) : children;
}

function normalizeNestedMarkdown(markdown: string): string {
  const lines = markdown.split("\n");

  // Remove outer padding from JSX/MDX so we only normalize meaningful content.
  while (lines.length > 0 && (lines[0] ?? "").trim().length === 0) {
    lines.shift();
  }
  while (
    lines.length > 0 &&
    (lines[lines.length - 1] ?? "").trim().length === 0
  ) {
    lines.pop();
  }

  if (lines.length === 0) {
    return "";
  }

  // Dedent by the smallest shared indentation to preserve fenced block structure.
  const minimumIndent = Math.min(
    ...lines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^[ \t]*/)![0].length),
  );

  if (!Number.isFinite(minimumIndent) || minimumIndent === 0) {
    return lines.join("\n");
  }

  return lines.map((line) => line.slice(minimumIndent)).join("\n");
}
