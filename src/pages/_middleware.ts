import { NextRequest, NextResponse } from 'next/server';
import domains from '../../newDomains.json';
const paths = domains.map(d => d[1]);
export default function middleware(req: NextRequest): NextResponse | void {
  const { pathname } = req.nextUrl;
  console.log(req);

  if (
    pathname &&
    paths.includes(pathname.slice(1)) &&
    !pathname.includes('.') && // exclude all files in the public folder
    !pathname.endsWith('/api') // exclude all API routes
  ) {
    const [matchedDomain, matchedPath] = domains.find(([, path]) => `/${path}` === pathname);
    if (matchedDomain && matchedPath) {
      const href =
        process.env.NODE_ENV === 'production'
          ? `/${matchedPath}`
          : `http://localhost:3000${matchedPath}`;
      console.log(href);

      return NextResponse.rewrite(href);
    }
  }
}
