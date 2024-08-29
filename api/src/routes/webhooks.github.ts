import { Webhooks } from "@octokit/webhooks";
import type { Request, Response } from "express";
import { badRequest, ok } from "../res";

import { onInstallation } from "../events/installation";
import { onPullRequestOpened } from "../events/pull_request.opened";
// import { onPullRequestSynchronize } from "../events/pull_request.synchronize";

export default async function githubWebhook(
  req: Request,
  res: Response,
): Promise<Response> {
  // Webhooks are POST requests from GitHub
  if (req.method.toUpperCase() !== "POST") {
    return badRequest(res, "Invalid method.");
  }

  // Get the body of the request (stringify since express converts it to JSON).
  const body = req.body;

  // Create a new instance of the Webhooks class with the GitHub App secret.
  const webhook = new Webhooks({
    secret: process.env.GITHUB_APP_WEBHOOK_SECRET!,
  });

  // Verify the signature of the request.
  const verified = await webhook.verify(
    JSON.stringify(body),
    String(req.headers["x-hub-signature-256"]),
  );

  if (!verified) {
    return badRequest(res, "Invalid signature.");
  }

  webhook.on("installation", onInstallation);
  webhook.on("pull_request.opened", onPullRequestOpened);
  // webhook.on("pull_request.synchronize", onPullRequestSynchronize);

  try {
    const id = String(req.headers["x-github-hook-id"]);

    // biome-ignore lint/suspicious/noExplicitAny: This will be a valid event name from GitHub.
    const name = String(req.headers["x-github-event"]) as any;

    await webhook.receive({
      id,
      name,
      payload: body,
    });

    return ok(res, { message: "OK" });
  } catch (e) {
    console.error(e);
    return badRequest(res, "Webhook request failed.");
  }
}
