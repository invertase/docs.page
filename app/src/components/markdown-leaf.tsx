import { code } from "@streamdown/code";
import { Streamdown } from "streamdown";
import type { ComponentProps } from "react";
import { Heading, type HeadingTag } from "@/components/mdx/heading";
import { Image } from "@/components/mdx/image";

type MarkdownLeafProps = {
  source: string;
  takeNextHeadingId: () => string | undefined;
};

type StreamdownComponents = NonNullable<
  ComponentProps<typeof Streamdown>["components"]
>;

export function MarkdownLeaf({
  source,
  takeNextHeadingId,
}: MarkdownLeafProps) {
  const components: StreamdownComponents = {
    h1: (props) => renderHeading("h1", props, takeNextHeadingId),
    h2: (props) => renderHeading("h2", props, takeNextHeadingId),
    h3: (props) => renderHeading("h3", props, takeNextHeadingId),
    h4: (props) => renderHeading("h4", props, takeNextHeadingId),
    h5: (props) => renderHeading("h5", props, takeNextHeadingId),
    h6: (props) => renderHeading("h6", props, takeNextHeadingId),
    img: ({ node: _node, ...props }) => <Image {...props} />,
  };

  return (
    <Streamdown
      mode="static"
      plugins={{ code }}
      components={components}
      linkSafety={{ enabled: false }}
      controls={{ code: { download: false } }}
    >
      {source}
    </Streamdown>
  );
}

function renderHeading(
  tag: HeadingTag,
  props: ComponentProps<HeadingTag>,
  takeNextHeadingId: () => string | undefined,
) {
  return <Heading {...props} id={takeNextHeadingId()} type={tag} />;
}

