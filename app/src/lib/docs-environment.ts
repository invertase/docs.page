export type DocsEnvironment = "development" | "preview" | "production";

export function getDocsEnvironment(): DocsEnvironment {
  if (!process.env.VERCEL) {
    return process.env.NODE_ENV === "production" ? "production" : "development";
  }

  return process.env.VERCEL_ENV === "production" ? "production" : "preview";
}

export function getPublicDocsSiteBase() {
  const environment = getDocsEnvironment();
  const port = process.env.PORT?.trim() || "3000";

  if (environment === "development") {
    return `http://localhost:${port}`;
  }

  if (environment === "preview") {
    return "https://staging.docs.page";
  }

  return "https://docs.page";
}

export function getRequestOrigin() {
  const port = process.env.PORT?.trim() || "3000";

  if (process.env.NODE_ENV !== "production") {
    return `http://localhost:${port}`;
  }

  const railwayPublicDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();

  if (railwayPublicDomain) {
    return `https://${railwayPublicDomain}`;
  }

  return getPublicDocsSiteBase();
}
