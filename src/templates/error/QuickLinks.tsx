import React from "react";

export function QuickLinks() {
  return (
    <div className="p-6 max-w-2xl mx-auto dark:text-white">
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="flex flex-wrap">
        <Link href="https://github.com/invertase/docs.page">
          docs.page on GitHub
        </Link>
        <Link href="https://github.com/invertase/docs.page/issues">
          Report an issue
        </Link>
        <Link href="https://docs.page/configuration">Configuration</Link>
        <Link href="https://docs.page/previews">Previews</Link>
        <Link href="https://docs.page/components">Components</Link>
        <Link href="https://docs.page/domains">Custom Domains</Link>
      </div>
    </div>
  );
}

function Link(props: React.HTMLProps<HTMLAnchorElement>) {
  return (
    <div className="mt-2 flex w-1/2">
      <a
        className="flex w-full mx-2 p-4 rounded hover:bg-gray-800"
        href={props.href}
      >
        {props.children}
      </a>
    </div>
  );
}
