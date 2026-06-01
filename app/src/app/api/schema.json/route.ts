import { ConfigSchema } from "@/server/config/schema";
import { zodToJsonSchema } from "zod-to-json-schema";

export async function GET() {
  return Response.json(
    zodToJsonSchema(
      ConfigSchema as unknown as Parameters<typeof zodToJsonSchema>[0],
    ),
    { status: 200 },
  );
}
