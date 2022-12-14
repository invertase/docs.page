export interface CodeBlockProps extends React.HTMLProps<HTMLPreElement> {
  raw: string;
  html: string;
}

const CodeBlock: React.FC<CodeBlockProps> = props => {
  return (
    <div className="group relative">
      <button
        data-copy
        data-copy-value={props.raw}
        className="absolute top-2 right-2 rounded bg-black px-3 py-1 font-mono text-xs opacity-0 transition hover:bg-black/50 group-hover:opacity-100 data-[copied=true]:[&>span]:hidden"
      >
        Copy
      </button>
      <div dangerouslySetInnerHTML={{ __html: props.html }}></div>
    </div>
  );
};

export default CodeBlock;
