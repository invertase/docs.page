import { GraphqlResponseError } from "@octokit/graphql";

type GitHubApiErrorSummary = {
  status?: number;
  message?: string;
  method?: string;
  url?: string;
  graphqlErrors?: string[];
};

type GitHubApiErrorLogContext = Record<
  string,
  string | number | boolean | null | undefined
>;
type GitHubApiErrorLogInput = string | GitHubApiErrorLogContext;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function summarizeGraphQLErrors(
  error: GraphqlResponseError<unknown>,
): string[] {
  return (error.errors ?? []).map((entry) => {
    const type = entry.type ? `${entry.type}: ` : "";
    const path = Array.isArray(entry.path) ? ` (${entry.path.join(".")})` : "";

    return `${type}${entry.message}${path}`;
  });
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
    ...(error instanceof GraphqlResponseError
      ? { graphqlErrors: summarizeGraphQLErrors(error) }
      : {}),
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
      entry.type === "NOT_FOUND" &&
      Array.isArray(entry.path) &&
      entry.path.join(".") === "repository",
  );
}

function normalizeLogContext(
  context: GitHubApiErrorLogInput | undefined,
): GitHubApiErrorLogContext {
  return typeof context === "string" ? { context } : (context ?? {});
}

function hasGitHubApiErrorSummary(summary: GitHubApiErrorSummary): boolean {
  return Boolean(
    summary.status ||
      summary.message ||
      summary.method ||
      summary.url ||
      summary.graphqlErrors?.length,
  );
}

function logGitHubErrorPayload(
  context: GitHubApiErrorLogContext,
  payload: GitHubApiErrorLogContext | GitHubApiErrorSummary,
) {
  console.error({
    ...context,
    ...payload,
  });
}

export function logGitHubApiError(
  error: unknown,
  context?: GitHubApiErrorLogInput,
) {
  const logContext = normalizeLogContext(context);
  const summary = getGitHubApiErrorSummary(error);

  if (hasGitHubApiErrorSummary(summary)) {
    logGitHubErrorPayload(logContext, summary);
    return;
  }

  if (error instanceof Error) {
    logGitHubErrorPayload(logContext, {
      name: error.name,
      message: error.message,
    });
    return;
  }

  console.error(error);
}
