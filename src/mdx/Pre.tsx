import React, { useState, useEffect, CSSProperties } from 'react';
import cx from 'classnames';
import Highlight, { Language, defaultProps } from 'prism-react-renderer';
import CopyToClipboard from 'react-copy-to-clipboard';

import dracula from 'prism-react-renderer/themes/palenight';
// import Prism from 'prismjs';
// import('prismjs/plugins/line-numbers/prism-line-numbers');

export interface PreProps extends React.HTMLProps<HTMLPreElement> {
  lang: Language;
  title?: string;
  raw?: string;
  highlight?: string;
}

export function Pre(props: PreProps) {
  const highlightLints = (props.highlight || '').split(',');
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

  // Override the Tailwind styles if a title is found
  const preStyles: CSSProperties = {};
  if (props.title) {
    preStyles.marginTop = 0;
    preStyles.borderTopLeftRadius = 0;
    preStyles.borderTopRightRadius = 0;
  }

  return (
    <>
      {!!props.title && (
        <div
          className="rounded-tr rounded-tl font-mono text-gray-300 text-sm px-4 py-2 border-b border-gray-600"
          style={{
            backgroundColor: 'rgb(41, 45, 62)',
          }}
        >
          {props.title}
        </div>
      )}
      <div className="relative group">
        <Highlight {...defaultProps} code={props.raw} language={props.lang} theme={dracula}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={className}
              style={{
                ...style,
                ...preStyles,
              }}
            >
              <code>
                <style jsx>{`
                  .highlight-line {
                    background: #1d1f2b;
                  }
                `}</style>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i });

                  if (highlightLints.includes(`${i + 1}`)) {
                    lineProps.className += ` highlight-line -mx-4 pl-4`;
                  }

                  return (
                    <div {...lineProps}>
                      {line.map((token, key) => {
                        // https://github.com/FormidableLabs/prism-react-renderer/issues/94
                        if (token.empty) return null;
                        return <span {...getTokenProps({ token, key })} />;
                      })}
                    </div>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
        <div
          className={cx(
            'opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 mr-2 mt-2',
            {
              'opacity-100': copied,
            },
          )}
        >
          <CopyToClipboard text={props.raw} onCopy={() => setCopied(true)}>
            <button className="text-white text-xs font-mono bg-gray-900 hover:bg-black transition-colors px-3 py-2 rounded-lg">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </>
  );
}
