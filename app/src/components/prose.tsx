import { useDocPageContext } from "@/hooks/use-doc-page-context";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  decodeComponentProps,
  normalizeCustomTags,
} from "@/lib/docs-markdown";
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

type StreamdownComponents = NonNullable<ComponentProps<typeof Streamdown>["components"]>;
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

const DOC_COMPONENTS: Record<string, DocComponent> = {
  image: ImageDocComponent,
};
const DOC_COMPONENT_NAMES = Object.keys(DOC_COMPONENTS);
const ALLOWED_TAGS: Record<string, string[]> = {
  div: ["data*"],
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
    <div className="max-w-none prose dark:prose-invert">
      <MarkdownBlock
        markdown={bundle.markdown}
        takeNextHeadingId={takeNextHeadingId}
      />
    </div>
  );
}

function MarkdownBlock({
  markdown,
  takeNextHeadingId,
}: MarkdownBlockProps) {
  const normalizedMarkdown = useMemo(
    () => normalizeCustomTags(markdown, DOC_COMPONENT_NAMES),
    [markdown],
  );
  const components = useMemo(
    () => createStreamdownComponents(takeNextHeadingId),
    [takeNextHeadingId],
  );

  return (
    <Streamdown allowedTags={ALLOWED_TAGS} components={components} linkSafety={{ enabled: false }}>
      {normalizedMarkdown}
    </Streamdown>
  );
}

function createStreamdownComponents(
  takeNextHeadingId: () => string | undefined,
): StreamdownComponents {
  const renderHeading = (
    Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    children: ReactNode,
    className?: string,
  ) => {
    const id = takeNextHeadingId();

    return (
      <Tag id={id} data-doc-heading="true" className={className}>
        {children}
      </Tag>
    );
  };

  const renderNestedMarkdown = (markdown: string) => (
    <MarkdownBlock
      markdown={markdown}
      takeNextHeadingId={takeNextHeadingId}
    />
  );

  return {
    h1: ({ children, className }) => renderHeading("h1", children, className),
    h2: ({ children, className }) => renderHeading("h2", children, className),
    h3: ({ children, className }) => renderHeading("h3", children, className),
    h4: ({ children, className }) => renderHeading("h4", children, className),
    h5: ({ children, className }) => renderHeading("h5", children, className),
    h6: ({ children, className }) => renderHeading("h6", children, className),
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
      const renderedChildren = markdown ? renderNestedMarkdown(markdown) : children;
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
          {renderedChildren ? <div className="mt-3">{renderedChildren}</div> : null}
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

function ImageDocComponent({
  src,
  alt,
  zoom,
  className,
}: DocComponentProps) {
  const imageSrc = typeof src === "string" ? src : "";
  const imageAlt = typeof alt === "string" ? alt : "";
  const isZoomEnabled = coerceBooleanProp(zoom);

  if (!imageSrc) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        Invalid Image component: missing <code>src</code>.
      </div>
    );
  }

  const image = (
    <img
      src={imageSrc}
      alt={imageAlt}
      loading="lazy"
      className={cn(
        "my-6 w-full rounded-xl border border-border bg-card object-cover shadow-sm",
        isZoomEnabled && "cursor-zoom-in transition-opacity hover:opacity-95",
        className,
      )}
    />
  );

  if (!isZoomEnabled) {
    return image;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="block w-full text-left">
          {image}
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-6xl border-none bg-transparent p-0 shadow-none ring-0"
        showCloseButton={false}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-h-[85vh] w-full rounded-xl object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}

function coerceBooleanProp(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "" || normalized === "true" || normalized === "1" || normalized === "yes";
  }

  return false;
}
