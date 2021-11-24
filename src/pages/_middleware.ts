import { NextRequest, NextResponse } from 'next/server';
import domains from '../../newDomains.json';

const domainsObjects = domains.map(([hostname, path]) => ({
  hostname,
  owner: path.split('/')[0],
  repo: path.split('/')[1],
}));

const hostnames = domains.map(d => d[0]);

export default function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;
  if (
    hostnames.includes(hostname) &&
    !pathname.includes('.') && // exclude all files in the public folder
    !pathname.endsWith('/api') // exclude all API routes
  ) {
    const { owner, repo } = domainsObjects.find(d => d.hostname === hostname);

    return NextResponse.rewrite(`/${owner}/${repo}`);
  }
}
