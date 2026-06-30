import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { getPostHogClient } from "@/lib/posthog";
import { hasDocsChanges } from "./docs-files";
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

  const owner = repository.owner.login;
  const repo = repository.name;
  const pull_number = pull_request.number;

  // Only comment when the pull request actually touches documentation files.
  // In a monorepo the bot would otherwise comment on every opened PR. Paginate
  // so PRs with more than 100 changed files are handled correctly.
  const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
    owner,
    repo,
    pull_number,
    per_page: 100,
  });

  if (!hasDocsChanges(files.map((file) => file.filename))) {
    console.log(
      `No documentation changes in ${name}#${pull_number}, skipping comment.`,
    );
    return;
  }

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
    owner,
    repo,
    issue_number: pull_number,
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
