import React from 'react';
import cx from 'classnames';
import { EyeOff } from './Icons';
import { useLocalStorageToggle } from '../hooks';

function TableOfContents(props: React.HTMLProps<HTMLDivElement>) {
  const [ref, toggle] = useLocalStorageToggle('table-of-contents');

  return (
    <section>
      <div className="flex items-end">
        <h3>Table of contents</h3>
        <Toggle label={<EyeOff size={14} />} onClick={() => toggle()} />
      </div>
      <nav ref={ref} {...props} className="toc mb-12 text-sm" />
    </section>
  );
}

function Toggle({ label, onClick }: { label: React.ReactElement; onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick()}
      className="mb-4 ml-4 text-xs px-2 py-1 rounded transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      {label}
    </div>
  );
}

export { TableOfContents };
