import { NextResponse } from "next/server";

/** Chrome and other clients probe `/.well-known/...`; never treat as `/{owner}/{repo}`. */
export function GET() {
  return new NextResponse(null, { status: 404 });
}

export function HEAD() {
  return new NextResponse(null, { status: 404 });
}
