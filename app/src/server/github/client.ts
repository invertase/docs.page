import { graphql } from "@octokit/graphql";
import { Octokit } from "octokit";
import { ENV } from "../env";

const getGitHubToken = (() => {
  let index = 0;
  const tokens = ENV.GITHUB_PAT.split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) {
    throw new Error(
      "Environment variable GITHUB_PAT is not defined or contains no valid tokens.",
    );
  }

  return () => {
    if (index >= tokens.length) {
      index = 0;
    }

    return tokens[index++];
  };
})();

export function getGitHubGraphQLClient(): typeof graphql {
  const token = getGitHubToken();

  return graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });
}

export function getGitHubRestClient(): Octokit {
  return new Octokit({
    auth: getGitHubToken(),
  });
}
