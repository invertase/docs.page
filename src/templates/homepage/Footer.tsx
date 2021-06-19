import React from 'react';
import { DarkModeToggle } from '../../components/DarkModeToggle';
import { ExternalLink } from '../../components/Link';

export function Footer(): JSX.Element {
  return (
    <footer className="flex font-mono opacity-50 hover:opacity-100 transition-opacity text-sm mb-5 py-4">
      <div className="flex-grow dark:text-white ">
        <div>
          © {new Date().getFullYear()}{' '}
          <ExternalLink href="https://invertase.io" className="hover:underline">
            Invertase
          </ExternalLink>{' '}
          | docs.page
        </div>
      </div>
      <div className="flex-shrink-0">
        <DarkModeToggle />
      </div>
    </footer>
  );
}
