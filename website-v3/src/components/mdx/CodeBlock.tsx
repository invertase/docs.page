export interface CodeBlockProps extends React.HTMLProps<HTMLPreElement> {
  raw: string;
  html: string;
}

const CodeBlock: React.FC<CodeBlockProps> = props => {
  return <div dangerouslySetInnerHTML={{ __html: props.html }}></div>;
};

export default CodeBlock;
