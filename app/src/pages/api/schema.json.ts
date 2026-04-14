import type { NextApiHandler } from "next";

import { zodToJsonSchema } from "zod-to-json-schema";

const handler: NextApiHandler = async (_req, res) => {
  const { ConfigSchema } = await import("@/server/config/schema");

  res
    .status(200)
    .setHeader("Content-Type", "application/json; charset=utf-8")
    .json(
      zodToJsonSchema(
        ConfigSchema as unknown as Parameters<typeof zodToJsonSchema>[0],
      ),
    );
};

export default handler;
