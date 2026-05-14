import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Error, Info, Success, Warning } from "@/components/mdx/callout";
import { Accordion, AccordionGroup } from "@/components/mdx/accordion";
import { Property } from "@/components/mdx/property";
import { Tabs } from "@/components/mdx/tabs";
import { YouTube } from "@/components/mdx/youtube";
import type { DocIrNode } from "@/lib/docs-ir/types";
import { MarkdownLeaf } from "./markdown-leaf";
import { Card, CardGroup } from "./mdx/card";
import { CodeFence } from "./mdx/code-fence";
import { Icon } from "./mdx/icon";
import { Image } from "./mdx/image";
import { Vimeo } from "./mdx/vimeo";
import { Video } from "./mdx/video";

type DocsIrRendererProps = {
  root: DocIrNode;
  takeNextHeadingId: () => string | undefined;
};

type TabItemProps = {
  label?: string;
  value?: string;
  children?: ReactNode;
};

export function DocsIrRenderer({
  root,
  takeNextHeadingId,
}: DocsIrRendererProps) {
  return renderNode(root, takeNextHeadingId, "root");
}

function renderNode(
  node: DocIrNode,
  takeNextHeadingId: () => string | undefined,
  key: string,
): ReactNode {
  switch (node.kind) {
    case "root":
      return node.children.map((child, index) => (
        <Fragment key={`${key}-${index}`}>
          {renderNode(child, takeNextHeadingId, `${key}-${index}`)}
        </Fragment>
      ));
    case "markdown":
      return (
        <MarkdownLeaf
          key={key}
          source={node.source}
          takeNextHeadingId={takeNextHeadingId}
        />
      );
    case "code":
      return (
        <CodeFence
          key={key}
          lang={node.lang}
          highlightedLang={node.highlightedLang}
          meta={node.meta}
          title={node.title}
          value={node.value}
          highlightedHtml={node.highlightedHtml}
        />
      );
    case "thematicBreak":
      return <hr key={key} />;
    case "component":
      return renderComponent(node, takeNextHeadingId, key);
  }
}

function renderComponent(
  node: Extract<DocIrNode, { kind: "component" }>,
  takeNextHeadingId: () => string | undefined,
  key: string,
): ReactNode {
  const children = node.children.map((child, index) =>
    renderNode(child, takeNextHeadingId, `${key}-${index}`),
  );

  const components = {
    Accordion: (
      <Accordion
        key={key}
        title={stringProp(node.props.title)}
        defaultOpen={booleanProp(node.props.defaultOpen)}
        icon={stringProp(node.props.icon)}
      >
        {children}
      </Accordion>
    ),
    AccordionGroup: (
      <AccordionGroup
        key={key}
        type={node.props.type as "single" | "multiple" | undefined}
      >
        {children}
      </AccordionGroup>
    ),
    Card: (
      <Card
        key={key}
        title={stringProp(node.props.title)}
        icon={stringProp(node.props.icon)}
        href={stringProp(node.props.href)}
      >
        {children}
      </Card>
    ),
    CardGroup: (
      <CardGroup key={key} cols={numberProp(node.props.cols)}>
        {children}
      </CardGroup>
    ),
    Property: (
      <Property
        key={key}
        name={stringProp(node.props.name)}
        type={stringProp(node.props.type)}
        required={booleanProp(node.props.required)}
        optional={booleanProp(node.props.optional)}
      >
        {children}
      </Property>
    ),
    Image: (
      <Image
        key={key}
        src={stringProp(node.props.src)}
        alt={stringProp(node.props.alt)}
        width={numberProp(node.props.width)}
        height={numberProp(node.props.height)}
        className={stringProp(node.props.className)}
        zoom={booleanProp(node.props.zoom)}
        caption={stringProp(node.props.caption)}
        theme={stringProp(node.props.theme) as "light" | "dark" | undefined}
      />
    ),
    Icon: (
      <Icon
        key={key}
        name={stringProp(node.props.name) ?? ""}
        size={numberProp(node.props.size)}
        style={styleProp(node.props.style)}
      />
    ),
    Info: <Info key={key}>{children}</Info>,
    Warning: <Warning key={key}>{children}</Warning>,
    Error: <Error key={key}>{children}</Error>,
    Success: <Success key={key}>{children}</Success>,
    Tabs: (
      <Tabs
        key={key}
        groupId={stringProp(node.props.groupId)}
        defaultValue={stringProp(node.props.defaultValue)}
      >
        {children}
      </Tabs>
    ),
    TabItem: (
      <TabItem
        key={key}
        label={stringProp(node.props.label)}
        value={stringProp(node.props.value)}
      >
        {children}
      </TabItem>
    ),
    YouTube: <YouTube key={key} id={stringProp(node.props.id)} />,
    Vimeo: <Vimeo key={key} id={stringProp(node.props.id)} video={stringProp(node.props.video)} />,
    Video: <Video key={key} src={stringProp(node.props.src)} type={stringProp(node.props.type)} />,
  };

  return (
    components[node.name as keyof typeof components] ?? (
      <InvalidDocComponent key={key} name={node.name} />
    )
  );
}

function TabItem({ children }: TabItemProps) {
  return <>{children}</>;
}

function InvalidDocComponent({ name }: { name: string }) {
  return (
    <div className="bg-destructive/80 text-white border border-destructive/50 rounded p-4 space-y-2">
      <p>Markdown contains an unknown component which could not be rendered:</p>
      <p>
        <code>{`<${name} />`}</code>
      </p>
    </div>
  );
}

function stringProp(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return undefined;
}

function booleanProp(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value === "" || value.toLowerCase() === "true";
  }
  return undefined;
}

function numberProp(value: unknown): number | undefined {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return Number(value);
  }
  return undefined;
}

function styleProp(value: unknown): CSSProperties | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as CSSProperties;
}

