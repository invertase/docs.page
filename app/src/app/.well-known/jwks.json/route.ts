import { getAgentCredentialsPublicJwks } from "@/server/agent/credentials-keys";

export function GET() {
  return Response.json(getAgentCredentialsPublicJwks(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
