import { parseMdx } from "@docs.page/mdx-bundler";

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

export async function GET() {
  await ensureWarmup();
  return new Response("OK", { status: 200 });
}
