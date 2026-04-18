import type { NextApiHandler } from "next";
import { getRedisClient } from "@/server/redis";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const time = performance.now();
  const client = await getRedisClient();

  if (!client) {
    return res.status(500).json({ error: "Redis connection failed." });
  }

  await client.ping();
  console.log(`Redis ping in ${performance.now() - time}ms`);

  return res.status(200).json(performance.now() - time);
};

export default handler;