import { CheckIcon, CopyIcon } from 'lucide-react';
import { ComponentProps, useState } from 'react';
import { cn } from '~/utils';

type CodeBlockProps = ComponentProps<'pre'> & {
  title?: string;
  raw?: string;
  html?: string;
};

export function CodeBlock(props: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function onCopy() {
    navigator.clipboard.writeText(props.raw!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Code blocks need the html prop to render from the bundler.
  if (!props.html) {
    return null;
  }

  return (
    <div className="not-prose relative group border border-black/10 dark:border-white/10 rounded-md shadow-sm overflow-hidden mb-5">
      {!!props.title && (
        <div className="bg-black text-primary text-xs border-b border-white/20 font-display tracking-wider">
          <div className="relative top-px inline-flex items-center px-4 border-b h-10 border-primary">
            {props.title}
          </div>
        </div>
      )}
      {!!props.raw && (
        <button
          className={cn('size-5 absolute right-4 z-10 text-white opacity-50 hover:opacity-75', {
            'top-2.5': !!props.title,
            'top-4': !props.title,
          })}
          onClick={onCopy}
        >
          {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
        </button>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: props.html }}
        className="[&>pre]:p-4 [&>pre]:overflow-x-auto text-sm leading-6"
      />
    </div>
  );
}
