import type { ComponentProps } from "react";
import type { ReactNode } from "react";
import type { Streamdown } from "streamdown";
import { Heading, type HeadingTag } from "@/components/mdx/heading";
import { Image } from "@/components/mdx/image";
import {
  buildFencedStreamdownComponents,
  type StreamdownComponents,
} from "@/lib/streamdown/doc-fenced-components";
import {
  hasUnknownCustomComponentMarker,
  shouldUnwrapParagraphNode,
} from "@/lib/streamdown/paragraph-unwrap";
import { propValue } from "@/lib/streamdown/streamdown-props";

export type { StreamdownComponents };

export function createStreamdownComponents(opts: {
  takeNextHeadingId: () => string | undefined;
  renderMarkdownBlock: (markdown: string) => ReactNode;
}): StreamdownComponents {
  const { takeNextHeadingId, renderMarkdownBlock } = opts;

  const renderHeading = (
    tag: HeadingTag,
    props: ComponentProps<HeadingTag>,
  ) => {
    const id = takeNextHeadingId();
    return <Heading {...props} id={id} type={tag} />;
  };

  const renderNestedMarkdown = (markdown: string) =>
    renderMarkdownBlock(markdown);

  const fenced = buildFencedStreamdownComponents(renderNestedMarkdown);

  return {
    h1: (props) => renderHeading("h1", props),
    h2: (props) => renderHeading("h2", props),
    h3: (props) => renderHeading("h3", props),
    h4: (props) => renderHeading("h4", props),
    h5: (props) => renderHeading("h5", props),
    h6: (props) => renderHeading("h6", props),
    div: ({ children, ...props }) => {
      if (!hasUnknownCustomComponentMarker(props)) {
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
    img: ({ node: _node, ...props }) => <Image {...props} />,
    ...fenced,
  };
}
