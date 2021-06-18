import React, { useState, useEffect, CSSProperties } from 'react';
import cx from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';
export interface PreProps extends React.HTMLProps<HTMLPreElement> {
  'data-title'?: string;
  'data-raw'?: string;
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
  const title = props['data-title'];
  const raw = decodeURIComponent(props['data-raw']);

  // Override the Tailwind styles if a title is found
  const preStyles: CSSProperties = {};
  if (title) {
    preStyles.marginTop = 0;
    preStyles.borderTopLeftRadius = 0;
    preStyles.borderTopRightRadius = 0;
  }

  return (
    <>
      {!!title && (
        <div className="rounded-tr rounded-tl font-mono text-gray-300 text-sm px-4 py-2 border-b border-[#2c394e] bg-[#1f2937]">
          {title}
        </div>
      )}
      <div className="relative group">
        <pre style={preStyles}>{props.children}</pre>
        <div
          className={cx(
            'opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 mr-2 mt-2',
            {
              'opacity-100': copied,
            },
          )}
        >
          <CopyToClipboard text={raw} onCopy={() => setCopied(true)}>
            <button className="text-white text-xs font-mono bg-gray-900 hover:bg-black transition-colors px-3 py-2 rounded-lg">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </>
  );
}
