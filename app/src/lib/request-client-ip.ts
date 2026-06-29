/**
 * Resolve the client IP from trusted edge headers (Railway, Cloudflare, etc.).
 * Prefer x-real-ip, then cf-connecting-ip, then the first x-forwarded-for hop.
 */
export function getRequestClientIp(req: Request): string | null {
  return (
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("cf-connecting-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null
  );
}
