import Link from 'next/link';
import React from 'react';

type Props = {
  href: string;
  children: string;
};

export function Button({ href, children }: Props) {
  return (
    <Link href={href}>
      <a className="px-6 py-2 border border-gray-600 hover:border-white no-underline rounded transition-all duration-100">
        {children}
      </a>
    </Link>
  );
}
