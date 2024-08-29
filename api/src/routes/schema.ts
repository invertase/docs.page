import type { Request, Response } from "express";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ConfigSchema } from "../config/schema";

export default async function schema(
  req: Request,
  res: Response,
): Promise<Response> {
  res.status(200);
  return res.json(zodToJsonSchema(ConfigSchema));
}
