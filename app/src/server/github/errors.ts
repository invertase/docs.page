import { GraphqlResponseError } from "@octokit/graphql";

type GitHubApiErrorSummary = {
  status?: number;
  message?: string;
  method?: string;
  url?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

export function getGitHubApiErrorSummary(
  error: unknown,
): GitHubApiErrorSummary {
  if (!isRecord(error)) {
    return {};
  }

  const request = isRecord(error.request) ? error.request : undefined;
  const response = isRecord(error.response) ? error.response : undefined;

  return {
    status: readNumber(error.status) ?? readNumber(response?.status),
    message: readString(error.message),
    method: readString(request?.method),
    url: readString(request?.url) ?? readString(response?.url),
  };
}

export function isGitHubApiErrorStatus(
  error: unknown,
  statuses: readonly number[],
) {
  const status = getGitHubApiErrorSummary(error).status;
  return typeof status === "number" && statuses.includes(status);
}

export function isGitHubRepositoryNotFoundGraphQLError(error: unknown) {
  if (!(error instanceof GraphqlResponseError)) {
    return false;
  }

  return (error.errors ?? []).some(
    (entry) =>
      entry.type === "NOT_FOUND" && entry.path.join(".") === "repository",
  );
}

export function logGitHubApiError(error: unknown, context?: string) {
  const summary = getGitHubApiErrorSummary(error);

  if (summary.status || summary.message || summary.method || summary.url) {
    console.error({
      context,
      ...summary,
    });
    return;
  }

  console.error(error);
}
