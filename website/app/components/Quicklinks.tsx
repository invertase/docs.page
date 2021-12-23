
import React from 'react';
// import {
//   GitHub,
//   Adjustments,
//   PullRequest,
//   Template,
//   GlobeAlt,
//   Issue,
//   Annotation,
//   SearchCircle,
// } from '../../components/Icons';

const linkData : LinkProps[] = [
    {
        href: "https://github.com/invertase/docs.page",
        children: "Contribute"
    },
    {
        href: "https://github.com/invertase/docs.page",
        children: "Report an issue"
    },
    {
        href: "https://github.com/invertase/docs.page",
        children: "Configuration"
    },
    {
        href: "https://github.com/invertase/docs.page",
        children: "Previews"
    },
    {
        href: "https://github.com/invertase/docs.page",
        children: "Components"
    },
    {
        href: "https://github.com/invertase/docs.page",
        children: "Custom Domains"
    },
    {
        href: "https://github.com/invertase/docs.page",
        children: "GitHub Bot"
    },
    {
        href: "https://github.com/invertase/docs.page",
        children: "Search"
    },
]

export function QuickLinks(): JSX.Element {
  return (
    <div className="dark:text-white mb-12 mt-10">
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="lg:flex flex-wrap">
            {linkData.map((link,i) => <Link key={i} href={link.href}>{link.children}</Link>)}
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
      <a
        className="flex items-center space-x-4 w-full mx-2 p-4 rounded hover:bg-gray-400/10"
        href={href}
      >
        {icon}
        <span>{children}</span>
      </a>
    </div>
  );
}