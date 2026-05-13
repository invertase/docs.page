import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Accordion as AccordionPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AccordionProps = PropsWithChildren<{
  title?: string;
  defaultOpen?: boolean;
  icon?: string;
}>;

function isAccordionElement(
  child: ReactNode,
): child is ReactElement<AccordionProps> {
  return (
    isValidElement<Partial<AccordionProps>>(child) &&
    child.type === Accordion
  );
}

function AccordionPanel({
  value,
  title,
  children,
}: PropsWithChildren<{ value: string; title: string }>) {
  return (
    <AccordionItem value={value} className="border-b px-4 last:border-b-0">
      <AccordionTrigger className="font-normal">{title}</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}

const rootClassName = "border rounded-lg";

export function Accordion({ title, defaultOpen, children }: AccordionProps) {
  if (!title) {
    return null;
  }

  return (
    <AccordionPrimitive
      type="single"
      collapsible
      className={rootClassName}
      defaultValue={defaultOpen ? "item" : undefined}
    >
      <AccordionPanel value="item" title={title}>
        {children}
      </AccordionPanel>
    </AccordionPrimitive>
  );
}

export function AccordionGroup({
  type = "multiple",
  children,
}: PropsWithChildren<{ type?: "single" | "multiple" }>) {
  const items = Children.toArray(children).filter(isAccordionElement);
  if (items.length === 0) {
    return null;
  }

  const defaultOpenValues = items.flatMap((item, i) => {
    const open = item.props.defaultOpen;
    return open !== undefined ? [`item-${i}`] : [];
  });

  const panels = items.map((item, index) => (
    <AccordionPanel
      key={item.key ?? index}
      value={`item-${index}`}
      title={item.props.title ?? ""}
    >
      {item.props.children}
    </AccordionPanel>
  ));

  if (type === "single") {
    return (
      <AccordionPrimitive
        type="single"
        collapsible
        className={rootClassName}
        defaultValue={defaultOpenValues[0]}
      >
        {panels}
      </AccordionPrimitive>
    );
  }

  return (
    <AccordionPrimitive
      type="multiple"
      className={rootClassName}
      defaultValue={
        defaultOpenValues.length > 0 ? defaultOpenValues : undefined
      }
    >
      {panels}
    </AccordionPrimitive>
  );
}
