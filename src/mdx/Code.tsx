import React, { useState, useEffect, cloneElement } from 'react';
import cx from 'classnames';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import CopyToClipboard from 'react-copy-to-clipboard';

export interface PreProps extends React.HTMLProps<HTMLPreElement> {
  live?: 'true' | 'false';
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

  return (
    <div className="relative group">
      <pre {...props} className={cx('relative z-0 mb-4', props.className)} />
      {!!props.copy && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 mr-2 mt-2">
          <CopyToClipboard text={props.copy} onCopy={() => setCopied(true)}>
            <button className="text-xs font-mono bg-gray-900 hover:bg-black transition-colors px-3 py-2 rounded-lg">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
}

export function LiveCode({ code }: { code: string }) {
  return (
    <div className="no-prose rounded overflow-hidden">
      <LiveProvider code={code} scope={{ useState, useEffect, cloneElement }}>
        <div className="font-mono font-bold text-gray-900 px-2 py-3 bg-gray-500">LIVE EDITOR</div>
        <div className="bg-gray-800">
          <LiveEditor />
        </div>
        <LiveError />
        <div>
          <div className="font-mono font-bold text-gray-900 px-2 py-3 bg-gray-500">RESULT</div>
          <div className="bg-gray-800 text-white">
            <LivePreview />
          </div>
        </div>
      </LiveProvider>
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
