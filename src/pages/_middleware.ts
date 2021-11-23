import { NextRequest, NextResponse } from 'next/server';
import domains from '../../domains.json';

const domainsObject = domains.map(([domain, path]) => ({
  domain,
  organization: path.split('/')[0],
  repo: path.split('/')[1],
}));

const domainStrings = domains.map(d => d[0]);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get('host');

  console.log(domainStrings.includes(hostname));

  if (
    req.nextUrl.host === '' &&
    !pathname.includes('.') && // exclude all files in the public folder
    pathname.endsWith('/api') // exclude all API routes
  ) {
    // rewrite to the current hostname under the pages/sites folder
    // the main logic component will happen in pages/sites/[site]/index.tsx
    return NextResponse.rewrite(`/${owner}/${repository}/:path*`);
  }
}
