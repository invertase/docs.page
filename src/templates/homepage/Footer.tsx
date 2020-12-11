import React from 'react';
import { ExternalLink } from '../../components/Link';

export function Footer() {
  return (
    <footer className="flex font-mono dark:text-white opacity-50 hover:opacity-100 transition-opacity text-sm mb-5 py-4">
      <div className="flex-1">
        <div>© {new Date().getFullYear()} Invertase | docs.page</div>
      </div>
      <div className="flex items-center space-x-6">
        <ExternalLink href="https://docs.page" className="hover:underline">
          <img src="/assets/docs-page-logo.png" alt="docs.page" className="h-6" />
        </ExternalLink>
        <ExternalLink href="https://github.com/invertase/docs.page" className="hover:underline">
          GitHub
        </ExternalLink>
        <ExternalLink href="https://invertase.io" className="hover:underline">
          Invertase
        </ExternalLink>
        <ExternalLink
          href="https://github.com/invertase/docs.page/issues"
          className="hover:underline"
        >
          Report an issue
        </ExternalLink>
      </div>
    </footer>
  );
}
