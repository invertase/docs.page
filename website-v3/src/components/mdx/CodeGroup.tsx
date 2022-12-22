import React, { isValidElement } from 'react';
import cx from 'classnames';
import type { ReactElement } from 'react';

export interface CodeGroupProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
  defaultLanguage?: string;
}

const CodeGroup: React.FC<CodeGroupProps> = props => {
  const preTags = React.Children.map(props.children, child => {
    if (isValidElement(child)) {
      console.log(child);
      if (child.props?.html?.startsWith('<pre')) {
        return child;
      }
    }
  });

  const groups = (preTags || []).filter(Boolean) as ReactElement[];

  if (groups.length === 0) {
    return <div />;
  }

  const languages = groups.map((group: ReactElement) => String(group.props.language) || 'text');

  const defaultLanguage = props.defaultLanguage || languages[0];

  return (
    <div data-code-group className="group mb-6 rounded-xl">
      <div className="flex h-12 items-center rounded-t-xl border border-white/10 bg-[#19191d] px-3">
        <span className="flex-grow">
          {!!props.title && (
            <span className="text-xs font-semibold tracking-wide text-white">{props.title}</span>
          )}
        </span>
        <span className="flex items-center gap-2 text-xs">
          {languages.map((language, i) => (
            <button
              aria-selected={i === 0}
              data-code-group-button
              data-code-group-button-id={language}
              key={language}
              className="aria-selected:text-docs-theme opacity-75 transition hover:opacity-100 aria-selected:opacity-100"
            >
              {language}
            </button>
          ))}
        </span>
      </div>
      <div className="relative">
        <button
          data-copy
          data-copy-value={groups.find(g => g.props.language === defaultLanguage)?.props.raw ?? ''}
          className="absolute top-2 right-2 rounded bg-[#19191d] px-3 py-1 font-mono text-xs text-white opacity-0 transition hover:bg-black/50 group-hover:opacity-100 data-[copied=true]:[&>span]:hidden"
        >
          Copy
        </button>
        {groups.map((group: ReactElement, index) => (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: group.props.html }}
            data-code-group-pane
            data-code-group-pane-id={languages[index]}
            data-code-group-pane-raw={group.props.raw}
            aria-expanded={defaultLanguage === languages[index]}
            className={cx(
              'not-prose hidden overflow-hidden border-white/10 text-xs [&>pre>code>.line]:leading-6 [&>pre]:p-3',
              {
                'aria-expanded:block': true,
                'rounded-b-xl dark:border-b dark:border-r dark:border-l': true,
              },
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default CodeGroup;
