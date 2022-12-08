import { useEffect, useState } from 'react';
import cx from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';

export interface PreProps extends React.HTMLProps<HTMLPreElement> {
  title?: string;
  raw: string;
  html: string;
}

export function Pre(props: PreProps): JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);
  let timeout: NodeJS.Timeout;

  useEffect(() => {
    if (copied) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  // Extract the data attributes from the component
  const title = props.title;
  const raw = decodeURIComponent(encodeURIComponent(props.raw));

  return (
    <>
      {!!title && (
        <div className="rounded-tr rounded-tl border-b border-gray-800 bg-[#0D1118] px-4 py-2 font-mono text-sm font-bold text-gray-300">
          {title}
        </div>
      )}
      <div className="group relative">
        <div
          className={cx('shiki-parent', {
            'shiki-parent-title': !!title,
          })}
          dangerouslySetInnerHTML={{ __html: props.html }}
        />
        <div
          className={cx(
            'absolute top-0 right-0 mr-2 mt-2 opacity-0 transition-opacity group-hover:opacity-100',
            {
              'opacity-100': copied,
            },
          )}
        >
          <CopyToClipboard text={raw} onCopy={() => setCopied(true)}>
            <button className="rounded-lg bg-black px-3 py-2 font-mono text-xs text-white transition-colors hover:bg-black/40">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </>
  );
}
