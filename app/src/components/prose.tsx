import { code } from "@streamdown/code";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { createDocsPageRehypePlugins } from "@/lib/markdown/plugins/docs-page-components";
import {
  Streamdown,
  defaultRemarkPlugins,
  type ExtraProps,
} from "streamdown";
import {
  Children,
  type ComponentProps,
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
  div: ["data*"],
  info: [],
  warning: [],
  error: [],
  success: [],
  tabs: ["groupid", "defaultvalue"],
  tabitem: [],
};

type StreamdownComponents = NonNullable<
  ComponentProps<typeof Streamdown>["components"]
>;

type MarkdownBlockProps = {
  markdown: string;
  takeNextHeadingId: () => string | undefined;
};

type HastElement = NonNullable<ExtraProps["node"]>;
type HastChild = HastElement["children"][number];

const CUSTOM_BLOCK_TAGS = new Set(Object.keys(COMPONENTS));

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
  const streamdownComponents = useMemo(
    () => createStreamdownComponents(takeNextHeadingId),
    [takeNextHeadingId],
  );
  const remarkPlugins = useMemo(() => Object.values(defaultRemarkPlugins), []);
  const rehypePlugins = useMemo(
    () => createDocsPageRehypePlugins(COMPONENTS),
    [],
  );

  return (
    <Streamdown
      allowedTags={COMPONENTS}
      plugins={{ code }}
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={streamdownComponents}
      linkSafety={{ enabled: false }}
      controls={{
        code: {
          download: false,
        },
      }}
      className="space-y-4 text-secondary-foreground [&>p]:leading-7 [&>p]:opacity-90"
    >
      {markdown}
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
    div: ({ children, ...props }) => {
      if (!hasUnknownComponentMarker(props)) {
        return <div {...props}>{children}</div>;
      }

      return (
        <div className="bg-destructive/80 text-white border border-destructive/50 rounded p-4 space-y-2">
          <p>
            Markdown contains an unknown component which could not be rendered:
          </p>
          <p>
            <code>{`<${propValue<string>(props, "data-name")} />`}</code>
          </p>
        </div>
      );
    },
    p: ({ children, node, ...props }) => {
      if (shouldUnwrapParagraphNode(node)) {
        return <>{children}</>;
      }

      return <p {...props}>{children}</p>;
    },
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

function shouldUnwrapParagraphNode(node: unknown): node is HastElement {
  if (!node || typeof node !== "object") {
    return false;
  }

  const paragraphNode = node as HastElement;
  if (paragraphNode.type !== "element" || paragraphNode.tagName !== "p") {
    return false;
  }

  let hasCustomBlockChild = false;
  for (const child of paragraphNode.children ?? []) {
    if (isWhitespaceHastText(child)) {
      continue;
    }

    if (isCustomBlockElement(child)) {
      hasCustomBlockChild = true;
      continue;
    }

    return false;
  }

  return hasCustomBlockChild;
}

function isCustomBlockElement(child: HastChild): child is HastElement {
  return (
    child.type === "element" &&
    (CUSTOM_BLOCK_TAGS.has(child.tagName) ||
      (child.tagName === "div" && hasUnknownComponentMarker(child.properties)))
  );
}

function isWhitespaceHastText(child: HastChild): boolean {
  return child.type === "text" && child.value.trim().length === 0;
}

function hasUnknownComponentMarker(
  props: Record<string, unknown> | undefined,
): boolean {
  // HAST stores data-* attributes as camelCase properties, while the React
  // renderer receives the same attributes with their dashed HTML names.
  return props
    ? Object.prototype.hasOwnProperty.call(props, "data-unknown-component") ||
        Object.prototype.hasOwnProperty.call(props, "dataUnknownComponent")
    : false;
}

function propValue<T>(
  props: Record<string, unknown>,
  key: string,
): T | undefined {
  return props[key] as T | undefined;
}

// Nested custom tags sometimes hand us plain text children that still need a
// second markdown pass; bail out once real elements are already present.
function extractTextOnlyContent(children: ReactNode): string | null {
  const childNodes = Children.toArray(children);

  if (childNodes.some((child) => isValidElement(child))) {
    return null;
  }

  return childNodes
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : "",
    )
    .join("");
}

// Re-run string-only custom-component bodies through Streamdown so markdown
// like headings, lists, and fences inside callouts/tabs render correctly.
function renderComponentChildren(
  children: ReactNode,
  renderNestedMarkdown: (markdown: string) => ReactNode,
): ReactNode {
  const textContent = extractTextOnlyContent(children);
  if (textContent === null) {
    return children;
  }

  const markdown = normalizeNestedMarkdown(textContent);
  return markdown ? renderNestedMarkdown(markdown) : children;
}

// Trim outer blank lines and remove shared indentation before the nested
// markdown pass so indented JSX-style children keep their intended structure.
function normalizeNestedMarkdown(markdown: string): string {
  const lines = markdown.split("\n");
  const startIndex = lines.findIndex((line) => line.trim().length > 0);

  if (startIndex === -1) {
    return "";
  }

  let endIndex = lines.length - 1;
  while (endIndex >= startIndex && lines[endIndex]?.trim().length === 0) {
    endIndex -= 1;
  }

  const contentLines = lines.slice(startIndex, endIndex + 1);
  const minimumIndent = Math.min(
    ...contentLines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^[ \t]*/)![0].length),
  );

  if (!Number.isFinite(minimumIndent) || minimumIndent === 0) {
    return contentLines.join("\n");
  }

  return contentLines
    .map((line) => line.slice(Math.min(minimumIndent, line.length)))
    .join("\n");
}
