import React from 'react';
import {
  GitHub,
  Adjustments,
  PullRequest,
  Template,
  GlobeAlt,
  Issue,
  Annotation,
  SearchCircle,
} from './Icons';

const defaultIconSize = 30;
const documentationLocation = 'https://use.docs.page';

const linkData: QuickLinkProps[] = [
  {
    href: 'https://github.com/invertase/docs.page',
    children: 'Contribute',
    icon: <GitHub size={defaultIconSize} />,
  },
  {
    href: 'https://github.com/invertase/docs.page/issues',
    children: 'Report an issue',
    icon: <Issue size={defaultIconSize} />,
  },
  {
    href: `${documentationLocation}/configuration`,
    children: 'Configuration',
    icon: <Adjustments size={defaultIconSize} />,
  },
  {
    href: `${documentationLocation}/previews`,
    children: 'Previews',
    icon: <PullRequest size={defaultIconSize} />,
  },
  {
    href: `${documentationLocation}/components`,
    children: 'Components',
    icon: <Template size={defaultIconSize} />,
  },
  {
    href: `${documentationLocation}/custom-domains`,
    children: 'Custom Domains',
    icon: <GlobeAlt size={defaultIconSize} />,
  },
  {
    href: `${documentationLocation}/github-bot`,
    children: 'GitHub Bot',
    icon: <Annotation size={defaultIconSize} />,
  },
  {
    href: `${documentationLocation}/search`,
    children: 'Search',
    icon: <SearchCircle size={defaultIconSize} />,
  },
];

export function QuickLinks(): JSX.Element {
  return (
    <div className="mb-12 mt-10 dark:text-white">
      <h2 className="mb-4 text-xl font-semibold">Quick Links</h2>
      <div className="flex-wrap lg:flex">
        {linkData.map((link, i) => (
          <QuickLink key={i} href={link.href} icon={link.icon}>
            {link.children}
          </QuickLink>
        ))}
      </div>
    </div>
  );
}

interface QuickLinkProps {
  href: string;
  children: string;
  icon?: React.ReactElement;
}

function QuickLink({ href, icon, children }: QuickLinkProps) {
  return (
    <div className="mt-2 flex lg:w-1/2 ">
      <a
        className="mx-2 flex w-full items-center space-x-4 rounded p-4 hover:bg-gray-400/10"
        href={href}
      >
        {icon}
        <span>{children}</span>
      </a>
    </div>
  );
}
