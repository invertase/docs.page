import { App, type Octokit } from "octokit";

export const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
});

export async function getOctokitForInstallation(installationId: number) {
  return await app.getInstallationOctokit(installationId);
}

export type OctokitInstallation = Awaited<
  ReturnType<typeof getOctokitForInstallation>
>;

// Type for a getFile response - assumes the repository is available
type GetFileResponse = {
  repository: {
    file?: {
      text: string;
    };
  };
};

// Queries a repository and extracts a file
export async function getDomains(
  octokit: Octokit,
): Promise<Array<[string, string]>> {
  const response = await octokit.graphql<GetFileResponse>(
    `
    query GetDomains($owner: String!, $repo: String!, $file: String!) {
      repository(owner: $owner, name: $repo) {
        file: object(expression: $file) {
          ... on Blob {
            text
          }
        }
      }
    }
    `,
    {
      owner: "invertase",
      repo: "docs.page",
      file: "main:domains.json",
    },
  );

  const file = response.repository.file?.text || "[]";
  return JSON.parse(file) as Array<[string, string]>;
}
