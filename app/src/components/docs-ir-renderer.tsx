import type { DocIrNode } from "@docs.page/mdx-bundler";
import { type CSSProperties, Fragment, type ReactNode } from "react";
import { Accordion, AccordionGroup } from "@/components/mdx/accordion";
import { Error, Info, Success, Warning } from "@/components/mdx/callout";
import { Property } from "@/components/mdx/property";
import { TabItem, Tabs } from "@/components/mdx/tabs";
import { Tweet } from "@/components/mdx/tweet";
import { YouTube } from "@/components/mdx/youtube";
import { MarkdownLeaf } from "./markdown-leaf";
import { Card, CardGroup } from "./mdx/card";
import { CodeFence } from "./mdx/code-fence";
import { CodeGroup, type CodeGroupBlock } from "./mdx/code-group";
import { Icon } from "./mdx/icon";
import { Image } from "./mdx/image";
import { Step, Steps } from "./mdx/steps";
import { Video } from "./mdx/video";
import { Vimeo } from "./mdx/vimeo";

type DocsIrRendererProps = {
  root: DocIrNode;
  takeNextHeadingId: () => string | undefined;
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
    case "html":
      // Sanitized with rehype-sanitize when the bundle is built (see sanitize-html.ts).
      return (
        <div
          key={key}
          className="not-prose contents"
          dangerouslySetInnerHTML={{ __html: node.source }}
        />
      );
    case "code":
      return (
        <CodeFence
          key={key}
          lang={node.lang}
          highlighted={node.highlighted ?? ""}
          meta={node.meta}
          title={node.title}
          value={node.value}
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
        label={stringProp(node.props.label) ?? ""}
        value={stringProp(node.props.value) ?? ""}
      >
        {children}
      </TabItem>
    ),
    Tweet: (
      <Tweet
        key={key}
        id={stringProp(node.props.id) ?? ""}
        cards={booleanProp(node.props.cards)}
        conversation={booleanProp(node.props.conversation)}
      />
    ),
    X: (
      <Tweet
        key={key}
        id={stringProp(node.props.id) ?? ""}
        cards={booleanProp(node.props.cards)}
        conversation={booleanProp(node.props.conversation)}
      />
    ),
    YouTube: <YouTube key={key} id={stringProp(node.props.id)} />,
    Vimeo: (
      <Vimeo
        key={key}
        id={stringProp(node.props.id)}
        video={stringProp(node.props.video)}
      />
    ),
    Video: (
      <Video
        key={key}
        src={stringProp(node.props.src)}
        type={stringProp(node.props.type)}
      />
    ),
    Steps: <Steps key={key}>{children}</Steps>,
    Step: (
      <Step
        key={key}
        title={stringProp(node.props.title)}
        icon={stringProp(node.props.icon)}
      >
        {children}
      </Step>
    ),
    CodeGroup: (
      <CodeGroup
        key={key}
        title={stringProp(node.props.title)}
        defaultLanguage={stringProp(node.props.defaultLanguage)}
        synchronize={booleanProp(node.props.synchronize)}
        blocks={codeBlocksFromChildren(node.children)}
      />
    ),
  };

  return (
    components[node.name as keyof typeof components] ?? (
      <InvalidDocComponent key={key} name={node.name} />
    )
  );
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

function codeBlocksFromChildren(children: DocIrNode[]): CodeGroupBlock[] {
  return children
    .filter(
      (child): child is Extract<DocIrNode, { kind: "code" }> =>
        child.kind === "code",
    )
    .map((block) => ({
      lang: block.lang || "text",
      highlighted: block.highlighted ?? "",
      value: block.value,
    }));
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
