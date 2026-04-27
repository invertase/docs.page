import { getRedisClient } from "@/server/redis";

export async function GET() {
  const time = performance.now();
  const client = await getRedisClient();

  if (!client) {
    return Response.json(
      { error: "Redis connection failed." },
      { status: 500 },
    );
  }

  await client.ping();
  console.log(`Redis ping in ${performance.now() - time}ms`);

  return Response.json(performance.now() - time, { status: 200 });
}
