import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { parse, serialize, type SerializeOptions } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import type { ResolvedDocsRoute } from "@/lib/docs-routing";

export const AGENT_SESSION_COOKIE_NAME = "agent_session";
export const AGENT_CSRF_COOKIE_NAME = "agent_session_csrf";
export const AGENT_SESSION_HEADER_NAME = "X-Agent-Session";

const AGENT_SESSION_AUDIENCE = "docs.page-agent";
const AGENT_SESSION_TTL_SECONDS = 60 * 60;

export interface AgentSessionClaims {
  aud: typeof AGENT_SESSION_AUDIENCE;
  owner: string;
  repo: string;
  sid: string;
  iat: number;
  exp: number;
}

interface CreateAgentSessionArgs {
  owner: string;
  repo: string;
  ttlSeconds?: number;
}

export async function createAgentSession({
  owner,
  repo,
  ttlSeconds = AGENT_SESSION_TTL_SECONDS,
}: CreateAgentSessionArgs) {
  const iat = Math.floor(Date.now() / 1000);
  const claims: AgentSessionClaims = {
    aud: AGENT_SESSION_AUDIENCE,
    owner,
    repo,
    sid: randomUUID(),
    iat,
    exp: iat + ttlSeconds,
  };

  return {
    claims,
    token: await signAgentSession(claims),
    csrfToken: deriveAgentCsrfToken(claims.sid),
  };
}

export async function verifyAgentSession(token: string) {
  try {
    const { payload, protectedHeader } = await jwtVerify(token, getAgentSessionKey(), {
      audience: AGENT_SESSION_AUDIENCE,
    });

    if (
      protectedHeader.alg !== "HS256" ||
      protectedHeader.typ !== "JWT" ||
      typeof payload.owner !== "string" ||
      typeof payload.repo !== "string" ||
      typeof payload.sid !== "string" ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    return {
      aud: AGENT_SESSION_AUDIENCE,
      owner: payload.owner,
      repo: payload.repo,
      sid: payload.sid,
      iat: payload.iat,
      exp: payload.exp,
    } satisfies AgentSessionClaims;
  } catch {
    return null;
  }
}

export function deriveAgentCsrfToken(sessionId: string) {
  return signValue(`csrf:${sessionId}`);
}

export function verifyAgentCsrfToken(sessionId: string, csrfToken: string) {
  return safeEqual(deriveAgentCsrfToken(sessionId), csrfToken);
}

export function createAgentSessionCookies(
  token: string,
  csrfToken: string,
  csrfPath: string,
  maxAgeSeconds = AGENT_SESSION_TTL_SECONDS,
) {
  return [
    serializeCookie(AGENT_SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: maxAgeSeconds,
      path: "/api/agent",
      sameSite: "lax",
    }),
    serializeCookie(AGENT_CSRF_COOKIE_NAME, csrfToken, {
      maxAge: maxAgeSeconds,
      path: csrfPath,
      sameSite: "lax",
    }),
  ];
}

export function clearAgentSessionCookies(csrfPath: string) {
  return [
    serializeCookie(AGENT_SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/api/agent",
      sameSite: "lax",
    }),
    serializeCookie(AGENT_CSRF_COOKIE_NAME, "", {
      maxAge: 0,
      path: csrfPath,
      sameSite: "lax",
    }),
  ];
}

export function parseCookies(cookieHeader: string | undefined) {
  return cookieHeader ? parse(cookieHeader) : {};
}

export function getAgentCsrfCookiePath(route: Pick<
  ResolvedDocsRoute,
  "requestMode" | "owner" | "repository" | "ref"
>) {
  if (route.requestMode === "custom-domain") {
    return "/";
  }

  const refSegment = route.ref ? `~${encodeURIComponent(route.ref)}` : "";

  if (route.requestMode === "vanity") {
    return `/${route.repository}${refSegment}`;
  }

  return `/${route.owner}/${route.repository}${refSegment}`;
}

async function signAgentSession(claims: AgentSessionClaims) {
  return await new SignJWT({
    owner: claims.owner,
    repo: claims.repo,
    sid: claims.sid,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setAudience(claims.aud)
    .setIssuedAt(claims.iat)
    .setExpirationTime(claims.exp)
    .sign(getAgentSessionKey());
}

function signValue(value: string) {
  return createHmac("sha256", getAgentSessionSecret())
    .update(value)
    .digest("base64url");
}

function serializeCookie(
  name: string,
  value: string,
  options: Pick<SerializeOptions, "httpOnly" | "maxAge" | "path" | "sameSite">,
) {
  return serialize(name, value, {
    ...options,
    secure: process.env.NODE_ENV === "production",
  });
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getAgentSessionSecret() {
  const secret = process.env.AGENT_SESSION_SECRET?.trim();

  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error("AGENT_SESSION_SECRET is not set.");
  }

  return secret || "dev-agent-session";
}

function getAgentSessionKey() {
  return textEncoder.encode(getAgentSessionSecret());
}

const textEncoder = new TextEncoder();
