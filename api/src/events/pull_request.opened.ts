import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { app, getDomains } from "../octokit";

export async function onPullRequestOpened(
	event: EmitterWebhookEvent<"pull_request.opened">,
) {
	const pull_request = event.payload.pull_request;
	const { repository } = event.payload;

	if (!event.payload.installation) {
		throw new Error("Installation not found.");
	}

	const octokit = await app.getInstallationOctokit(
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

	await octokit.graphql(
		`
		mutation($subjectId: ID!, $body: String!) {
			addComment(input: {subjectId: $subjectId, body: $body}) {
				commentEdge {
					node {
						id
						body
					}
				}
			}
  	}
	`,
		{
			subjectId: pull_request.node_id,
			body: comment,
		},
	);
}