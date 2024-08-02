import { type EmitterWebhookEvent, Webhooks } from "@octokit/webhooks";
import type { Request, Response } from "express";
import { badRequest, ok } from "../res";

import { app, getDomains } from "../octokit";

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

	webhook.on("pull_request.opened", onPullRequestOpened);

	try {
		const id = req.headers["x-github-hook-id"] as string;
		// biome-ignore lint/suspicious/noExplicitAny: This will be a valid event name from GitHub.
		const name = req.headers["x-github-event"] as any;

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

async function onPullRequestOpened(
	event: EmitterWebhookEvent<"pull_request.opened">,
) {
	const pull_request = event.payload.pull_request;
	const { repository } = event.payload;

	// org/repo
	const name = repository.full_name.toLowerCase();

	// Fetch the domains file from the main repository
	const domains = await getDomains();

	// Find a custom domain for the repository, if it exists
	const domain = domains.find(([, repository]) => repository === name)?.[0];

	// Build a domain URL for the comment
	const url = domain
		? `${domain}/~${pull_request.number}`
		: `docs.page/${name}~${pull_request.number}`;

	const comment = `To view this pull requests documentation preview, visit the following URL:
\n\n\
[${url}](https://${url})
\n\n\
Documentation is deployed and generated using [docs.page](https://docs.page).`;

	// Post a comment on the pull request
	await app.octokit.rest.issues.createComment({
		owner: repository.owner.login,
		repo: repository.name,
		issue_number: pull_request.number,
		body: comment,
	});
}
