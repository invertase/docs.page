import type { Request, Response } from "express";
import { Webhooks, type EmitterWebhookEvent } from "@octokit/webhooks";
import { badRequest, ok } from "../res";

export default async function githubWebhook(
  req: Request,
  res: Response
): Promise<Response> {
  // Webhooks are POST requests from GitHub
  if (req.method.toUpperCase() !== "POST") {
    return badRequest(res, "Invalid method.");
  }

  // Get the body of the request.
  const body = req.body;

  // Create a new instance of the Webhooks class with the GitHub App secret.
  const webhook = new Webhooks({
    secret: "", // TODO
  });

  // Verify the signature of the request.
  const verified = await webhook.verify(
    body,
    String(req.headers["x-hub-signature-256"])
  );

  if (!verified) {
    return badRequest(res, "Invalid signature.");
  }

  webhook.on("pull_request.opened", onPullRequestOpened);

  try {
    const id = req.headers["x-github-hook-id"] as string;
    // biome-ignore lint/suspicious/noExplicitAny: This will be a valid event name from GitHub.
    const name = req.headers["x-github-event"] as any;
    const payload = JSON.parse(body);

    await webhook.receive({
      id,
      name,
      payload,
    });

    return ok(res, { message: "OK" });
  } catch (e) {
    console.error(e);
    return badRequest(res, "Webhook request failed.");
  }
}

async function onPullRequestOpened(
  event: EmitterWebhookEvent<"pull_request.opened">
) {}
