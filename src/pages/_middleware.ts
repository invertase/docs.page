import { NextRequest, NextResponse } from 'next/server';
import domains from '../../newDomains.json';

const domainsObjects = domains.map(([hostname, pathname]) => ({
  hostname,
  pathname: `/${pathname}`,
}));

const pathnames = domains.map(d => `/${d[1]}`);

export default function middleware(req: NextRequest): NextResponse | void {
  const { pathname } = req.nextUrl;

  if (
    pathnames.includes(req.nextUrl.pathname) &&
    !pathname.includes('.') && // exclude all files in the public folder
    !pathname.endsWith('/api') // exclude all API routes
  ) {
    // console.log(domainsObjects);
    const { hostname } = domainsObjects.find(d => d.pathname === pathname);
    const href =
      process.env.NODE_ENV === 'production'
        ? `/${hostname}${pathname}`
        : `http://localhost:3000${pathname}`;

    return NextResponse.rewrite(href);
  }
}
