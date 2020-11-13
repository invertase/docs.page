import { graphql } from "@octokit/graphql";

export const GithubGQLClient = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_PAT}`,
  },
});

export function isClient(): boolean {
  return typeof window !== "undefined";
}
