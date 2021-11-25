import { NextRequest, NextResponse } from 'next/server';
import domains from '../../newDomains.json';

const paths = domains.map(d => d[1]);

export default function middleware(req: NextRequest): NextResponse | void {
  const { pathname } = req.nextUrl;
  const path = pathname.slice(1); // remove '/' at start
  const [matchedDomain, matchedPath] = domains.find(([domain, path]) => `/${path}` === pathname);

  if (
    matchedDomain &&
    matchedPath &&
    !pathname.includes('.') && // exclude all files in the public folder
    !pathname.endsWith('/api') // exclude all API routes
  ) {
    const href =
      process.env.NODE_ENV === 'production'
        ? `https://${matchedDomain}${matchedPath}`
        : `http://localhost:3000${matchedPath}`;

    return NextResponse.rewrite(href);
  }
}
