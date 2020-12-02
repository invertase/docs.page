import React from 'react';
import { useEditUrl } from '../hooks';
import { Pencil } from './Icons';
import { ExternalLink } from './Link';

function Footer() {
  const edit = useEditUrl();

  return (
    <footer className="flex dark:text-white font-mono text-sm">
      <div className="flex-1">
        Powered by{' '}
        <ExternalLink href="https://docs.page" className="font-bold hover:underline">
          docs.page
        </ExternalLink>
      </div>
      <ExternalLink href={edit} className="flex hover:underline">
        <Pencil size={16} />
        <span className="pl-2">Edit this page</span>
      </ExternalLink>
    </footer>
  );
}

export { Footer };
