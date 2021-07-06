import React from 'react';

import { ExternalLink } from '../../components/Link';
import {
  GitHub,
  Adjustments,
  PullRequest,
  Template,
  GlobeAlt,
  Issue,
  Annotation,
  SearchCircle,
} from '../../components/Icons';

export function QuickLinks(): JSX.Element {
  return (
    <div className="dark:text-white mb-12">
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="lg:flex flex-wrap">
        <Link href="https://github.com/invertase/docs.page" icon={<GitHub size={30} />}>
          Contribute
        </Link>
        <Link href="https://github.com/invertase/docs.page/issues" icon={<Issue size={30} />}>
          Report an issue
        </Link>
        <Link href="https://use.docs.page/configuration" icon={<Adjustments size={30} />}>
          Configuration
        </Link>
        <Link href="https://use.docs.page/previews" icon={<PullRequest size={30} />}>
          Previews
        </Link>
        <Link href="use.https://use.docs.page/components" icon={<Template size={30} />}>
          Components
        </Link>
        <Link href="https://use.docs.page/custom-domains" icon={<GlobeAlt size={30} />}>
          Custom Domains
        </Link>
        <Link href="https://use.docs.page/github-bot" icon={<Annotation size={30} />}>
          GitHub Bot
        </Link>
        <Link href="https://use.docs.page/search" icon={<SearchCircle size={30} />}>
          Search
        </Link>
      </div>
    </div>
  );
}

interface LinkProps {
  href: string;
  children: string;
  icon?: React.ReactElement;
}

function Link({ href, icon, children }: LinkProps) {
  return (
    <div className="mt-2 flex lg:w-1/2 ">
      <ExternalLink
        className="flex items-center space-x-4 w-full mx-2 p-4 rounded hover:bg-gray-400/10"
        href={href}
      >
        {icon}
        <span>{children}</span>
      </ExternalLink>
    </div>
  );
}
