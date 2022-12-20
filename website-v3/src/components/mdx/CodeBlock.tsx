import cx from 'classnames';

export interface CodeBlockProps extends React.HTMLProps<HTMLPreElement> {
  title?: string;
  raw: string;
  html: string;
}

const CodeBlock: React.FC<CodeBlockProps> = props => {
  console.log('title', props.title);
  return (
    <div>
      <div className="group mb-6 rounded-xl">
        {!!props.title && (
          <div className="rounded-t-xl border border-white/10 bg-[#19191d] py-2 px-4">
            <span className="text-xs font-semibold tracking-wide text-white">{props.title}</span>
          </div>
        )}
        <div className="relative">
          <button
            data-copy
            data-copy-value={props.raw}
            className="absolute top-2 right-2 rounded bg-[#19191d] px-3 py-1 font-mono text-xs text-white opacity-0 transition hover:bg-black/50 group-hover:opacity-100 data-[copied=true]:[&>span]:hidden"
          >
            Copy
          </button>
          <div
            dangerouslySetInnerHTML={{ __html: props.html }}
            className={cx('overflow-hidden border-white/10 text-sm [&>pre>code>.line]:leading-6', {
              'rounded-xl border': !props.title,
              'rounded-b-xl dark:border-b dark:border-r dark:border-l': !!props.title,
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
