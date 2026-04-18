import type { NextApiHandler } from "next";

import { parseMdx } from "@/server/docs/bundler/mdx";

let warmupComplete = false;
let warmupPromise: Promise<void> | null = null;

async function ensureWarmup() {
  if (warmupComplete) {
    return;
  }

  if (!warmupPromise) {
    warmupPromise = Promise.all([
      parseMdx("**Hello!**", {
        headerDepth: 3,
        components: [],
      }),
    ]).then(() => {
      warmupComplete = true;
    });
  }

  try {
    await warmupPromise;
  } catch (error) {
    warmupPromise = null;
    throw error;
  }
}

const handler: NextApiHandler = async (_, res) => {
  await ensureWarmup();
  res.status(200);
  res.end("OK");
};

export default handler;
