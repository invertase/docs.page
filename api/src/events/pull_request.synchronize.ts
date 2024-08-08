import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { getDomains, getOctokitForInstallation } from "../octokit";
import { createGitHubCheckRun } from "../utils/github";

export async function onPullRequestSynchronize(
	event: EmitterWebhookEvent<"pull_request.synchronize">,
) {
	const pull_request = event.payload.pull_request;
	const { repository } = event.payload;

	if (!event.payload.installation) {
		throw new Error("Installation not found.");
	}

	// Get an Octokit instance for the installation event.
	const octokit = await getOctokitForInstallation(
		event.payload.installation.id,
	);

	await createGitHubCheckRun(
		octokit,
		repository.owner.login,
		repository.name,
		pull_request.head.sha,
	);
}
