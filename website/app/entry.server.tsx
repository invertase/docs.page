import { renderToString } from 'react-dom/server';
import { RemixServer } from 'remix';
import type { EntryContext } from 'remix';
import etag from 'etag';

if (process.env.MSW_ENABLED === '1') {
  require('../tests/mocks');
}
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  headers: Headers,
  remixContext: EntryContext,
): Response {
  headers.set('Content-Type', 'text/html');

  // If the request is valid
  if (responseStatusCode === 200) {
    // Create an etag 
    headers.set('ETag', etag(JSON.stringify(remixContext.routeData)));

    if (request.headers.get('If-None-Match') === headers.get('ETag')) {
      return new Response('', { status: 304, headers: headers });
    }
  }

  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers,
  });
}
