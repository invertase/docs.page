import { renderToString } from 'react-dom/server';
import { RemixServer } from 'remix';
import type { EntryContext } from 'remix';
import { StaticRouter } from "react-router-dom/server";

if (process.env.MSW_ENABLED === '1') {
  require('../tests/mocks');
}
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  headers: Headers,
  remixContext: EntryContext,
): Response {
  const markup = renderToString(<StaticRouter location={new URL(request.url)}>
    <RemixServer context={remixContext} url={request.url} />
  </StaticRouter>);

  headers.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers,
  });
}
