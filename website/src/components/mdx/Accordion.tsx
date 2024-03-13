export interface AccordionProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = props => {
  return (
    <details
      open={!!props.defaultOpen}
      className="cursor-pointer overflow-hidden rounded-xl border dark:border-white/10"
    >
      <summary className="w-full gap-3 px-6 py-3 hover:bg-black/10 dark:hover:bg-black/20">
        <span className="pl-1 font-semibold">{props.title}</span>
      </summary>
      <div className="[&>:first-child]:mt-0 p-6">{props.children}</div>
    </details>
  );
};

export default Accordion;
