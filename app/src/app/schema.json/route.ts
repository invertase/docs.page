import { ConfigSchema } from "@/server/config/schema";

export async function GET() {
  return Response.json(
    ConfigSchema.toJSONSchema({ io: "input", unrepresentable: "any" }),
  );
}
