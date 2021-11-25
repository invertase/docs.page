import { NextRequest, NextResponse } from 'next/server';
import domains from '../../newDomains.json';

export default function middleware(req: NextRequest): NextResponse | void {
  const { pathname } = req.nextUrl;

  const [matchedDomain, matchedPath] = domains.find(([, path]) => `/${path}` === pathname);

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
