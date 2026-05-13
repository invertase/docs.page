import type { ComponentProps } from "react";
import type { ReactNode } from "react";
import type { Streamdown } from "streamdown";
import type { ExtraProps } from "streamdown";
import { Info, Success, Warning, Error } from "@/components/mdx/callout";
import { Tabs } from "@/components/mdx/tabs";
import { YouTube } from "@/components/mdx/youtube";
import { renderComponentChildren } from "@/lib/streamdown/nested-markdown";
import { propValue, youtubeVideoIdFromSanitizedProps } from "@/lib/streamdown/streamdown-props";

export type StreamdownComponents = NonNullable<
  ComponentProps<typeof Streamdown>["components"]
>;

type StreamdownElementProps = {
  children?: ReactNode;
  node?: ExtraProps["node"];
} & Record<string, unknown>;

export type FencedDocComponentConfig = {
  readonly tag: string;
  readonly attrs: readonly string[];
  readonly render: (
    props: StreamdownElementProps,
    renderNestedMarkdown: (markdown: string) => ReactNode,
  ) => ReactNode;
};

/**
 * Fenced / custom tags in repo markdown. One row per component — sanitize
 * allowlist and Streamdown component map are derived from this list.
 */
export const DOC_FENCED_TAG_CONFIGS: readonly FencedDocComponentConfig[] = [
  {
    tag: "info",
    attrs: [],
    render: ({ children }, renderNested) => (
      <Info>
        {renderComponentChildren(children as ReactNode, renderNested)}
      </Info>
    ),
  },
  {
    tag: "warning",
    attrs: [],
    render: ({ children }, renderNested) => (
      <Warning>
        {renderComponentChildren(children as ReactNode, renderNested)}
      </Warning>
    ),
  },
  {
    tag: "error",
    attrs: [],
    render: ({ children }, renderNested) => (
      <Error>
        {renderComponentChildren(children as ReactNode, renderNested)}
      </Error>
    ),
  },
  {
    tag: "success",
    attrs: [],
    render: ({ children }, renderNested) => (
      <Success>
        {renderComponentChildren(children as ReactNode, renderNested)}
      </Success>
    ),
  },
  {
    tag: "tabs",
    attrs: ["groupid", "defaultvalue"],
    render: ({ children, ...props }, renderNested) => (
      <Tabs
        node={props.node}
        groupId={propValue(props, "groupid")}
        defaultValue={propValue(props, "defaultvalue")}
      >
        {renderComponentChildren(children as ReactNode, renderNested)}
      </Tabs>
    ),
  },
  {
    tag: "tab-item",
    attrs: [],
    render: ({ children }, renderNested) =>
      renderComponentChildren(children as ReactNode, renderNested),
  },
  {
    tag: "you-tube",
    attrs: ["id", "videoid"],
    render: (props, _renderNested) => (
      <YouTube id={youtubeVideoIdFromSanitizedProps(props)} />
    ),
  },
];

export function buildFencedStreamdownComponents(
  renderNestedMarkdown: (markdown: string) => ReactNode,
): Partial<StreamdownComponents> {
  const out: Partial<StreamdownComponents> = {};
  for (const cfg of DOC_FENCED_TAG_CONFIGS) {
    out[cfg.tag as keyof StreamdownComponents] = ((props: Record<string, unknown> & StreamdownElementProps) =>
      cfg.render(props, renderNestedMarkdown)) as StreamdownComponents[keyof StreamdownComponents];
  }
  return out;
}
