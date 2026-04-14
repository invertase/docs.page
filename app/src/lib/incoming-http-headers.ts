import type { IncomingHttpHeaders, IncomingMessage } from "node:http";

/** Build a Web `Headers` from Node request headers (for `resolveDocsRoute` and similar). */
export function incomingHttpHeadersToWebHeaders(
  incoming: IncomingHttpHeaders,
): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) headers.append(key, v);
  }
  return headers;
}

export function getRequestOrigin(
  request: Pick<IncomingMessage, "headers">,
): string {
  const protocol = Array.isArray(request.headers["x-forwarded-proto"])
    ? request.headers["x-forwarded-proto"][0]
    : request.headers["x-forwarded-proto"] ?? "http";
  const host = Array.isArray(request.headers["x-forwarded-host"])
    ? request.headers["x-forwarded-host"][0]
    : request.headers["x-forwarded-host"]
      ?? (Array.isArray(request.headers.host)
        ? request.headers.host[0]
        : request.headers.host)
      ?? "localhost";

  return `${protocol}://${host}`;
}

export function getAbsoluteRequestUrl(
  request: Pick<IncomingMessage, "headers" | "url">,
): string {
  return new URL(request.url ?? "/", getRequestOrigin(request)).toString();
}
