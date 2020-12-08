import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';

export interface PreProps extends React.HTMLProps<HTMLPreElement> {
  raw?: string;
  copy?: string;
}

export function Pre(props: PreProps) {
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

  // Extract non-default properties
  const { raw, copy, ...preProps } = props;

  return (
    <div className="relative group">
      <pre {...preProps} className={cx('relative z-0 mb-4', props.className)} />
      {!!copy && (
        <div
          className={cx(
            'opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 mr-2 mt-2',
            {
              'opacity-100': copied,
            },
          )}
        >
          <CopyToClipboard text={copy} onCopy={() => setCopied(true)}>
            <button className="text-white text-xs font-mono bg-gray-900 hover:bg-black transition-colors px-3 py-2 rounded-lg">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
}

export function withCodeBlockTitle(title: string, children: React.ReactNode) {
  return (
    <>
      <div className="bg-gray-800 border-gray-700 text-white font-mono border-b px-4 py-2 rounded-tr rounded-tl text-sm font-bold">
        {title}
      </div>
      {children}
    </>
  );
}
