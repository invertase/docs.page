import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { getOctokitForInstallation } from "src/octokit";

export async function onPullRequestClosed(
  event: EmitterWebhookEvent<"pull_request.closed">,
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

  try {
    // Get all files in the docs directory
    const { data: tree } = await octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
      owner: repository.owner.login,
      repo: repository.name,
      tree_sha: pull_request.merge_commit_sha!,
    });

    // Filter for MDX files in the docs directory and create a map
    const docsMap = tree.tree
      .filter(file => 
        file.path?.startsWith("docs/") && 
        file.path.endsWith(".mdx")
      )
      .reduce((acc, file) => {
        if (file.path) {
          acc[file.path] = {
            path: file.path,
            sha: file.sha,
            url: file.url
          };
        }
        return acc;
      }, {} as Record<string, { path: string; sha: string; url: string }>);

    console.log("Found docs files:", docsMap);
    
    // You can now use this map for further processing
    // For example, store it in a database, trigger builds, etc.

  } catch (error) {
    console.error("Error processing merged PR:", error);
  }
} 