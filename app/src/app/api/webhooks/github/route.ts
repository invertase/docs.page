import { Webhooks } from "@octokit/webhooks";
import { onPullRequestOpened } from "./pull_request.opened";

let webhook: Webhooks | undefined;

function getWebhook() {
  if (webhook) {
    return webhook;
  }

  const secret = process.env.GITHUB_APP_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "GITHUB_APP_WEBHOOK_SECRET environment variable is required.",
    );
  }

  webhook = new Webhooks({ secret });
  return webhook;
}

export const POST = async (req: Request) => {
  const webhook = getWebhook();
  const body = await req.text();

  // Verify the signature of the request.
  const verified = await webhook.verify(
    body,
    String(req.headers.get("x-hub-signature-256")),
  );

  if (!verified) {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  webhook.on("pull_request.opened", onPullRequestOpened);

  try {
    const id = String(req.headers.get("x-github-hook-id"));
    // biome-ignore lint/suspicious/noExplicitAny: This will be a valid event name from GitHub.
    const name = String(req.headers.get("x-github-event")) as any;

    await webhook.receive({
      id,
      name,
      payload: JSON.parse(body),
    });

    return Response.json({ message: "OK" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Webhook request failed." }, { status: 400 });
  }
};
