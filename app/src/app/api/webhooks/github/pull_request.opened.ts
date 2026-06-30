import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { getPostHogClient } from "@/lib/posthog";
import { getOctokitForInstallation } from "./octokit";

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

  const domain = await fetch(
    `https://custom-domain.invertase.workers.dev/?owner=${repository.owner.login}&repo=${repository.name}`,
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch custom domain.");
      }

      return res.json();
    })
    .then((json) => String(json.domain))
    .catch(() => null);

  // Build a domain URL for the comment
  const url = domain
    ? `${domain}/~${pull_request.number}`
    : `docs.page/${name}~${pull_request.number}`;

  const comment = `To preview the documentation for this pull request, visit the following URL:
  \n\n\
  [${url}](https://${url})
  \n\n\
  > *Documentation is deployed and generated using [docs.page](https://docs.page)*`;

  await octokit.rest.issues.createComment({
    owner: repository.owner.login,
    repo: repository.name,
    issue_number: pull_request.number,
    body: comment,
  });

  getPostHogClient().capture({
    distinctId: repository.full_name.toLowerCase(),
    event: "github:preview_comment_create",
    properties: {
      owner: repository.owner.login,
      repository: repository.name,
      pr_number: pull_request.number,
      has_custom_domain: Boolean(domain),
      $process_person_profile: false,
    },
  });
}
