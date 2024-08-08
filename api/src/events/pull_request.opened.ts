import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { getDomains, getOctokitForInstallation } from "../octokit";
import { createGitHubCheckRun } from "../utils/github";

export async function onPullRequestOpened(
	event: EmitterWebhookEvent<"pull_request.opened">,
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

	// org/repo
	const name = repository.full_name.toLowerCase();

	// Fetch the domains file from the main repository
	const domains = await getDomains(octokit);

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

	await octokit.rest.issues.createComment({
		owner: repository.owner.login,
		repo: repository.name,
		issue_number: pull_request.number,
		body: comment,
	});

	// await createGitHubCheckRun(
	//   octokit,
	//   repository.owner.login,
	//   repository.name,
	//   pull_request.head.sha
	// );
}
