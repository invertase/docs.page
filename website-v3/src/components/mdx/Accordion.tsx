export interface AccordionProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = props => {
  return (
    <div data-accordion>
      <button data-accordion-button className="flex items-center gap-3">
        <span>ARROW</span>
        <span>{props.title}</span>
      </button>
      <div
        data-accordion-pane
        aria-expanded={!!props.defaultOpen}
        className="hidden aria-expanded:block"
      >
        {props.children}
      </div>
    </div>
  );
};

export default Accordion;
