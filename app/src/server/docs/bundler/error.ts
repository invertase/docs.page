import type { Config } from "@/server/config";

type BundlerErrorDetails = Record<
  string,
  string | number | boolean | null | undefined
>;

export class BundlerError extends Error {
  code: number;
  name: string;
  source?: string;
  branding?: DocsBranding;
  details?: BundlerErrorDetails;
  /**
   * Parsed site config, attached on the 404 (FILE_NOT_FOUND) path. The GraphQL
   * query already returns the config blob even when the mdx is missing, so the
   * page's not-found branch can honour config-level `redirects` without a second
   * fetch. Undefined when no config exists or it fails to parse.
   */
  config?: Config;

  constructor({
    code,
    name,
    message,
    source,
    branding,
    details,
    config,
  }: {
    code: number;
    name: string;
    message: string;
    source?: string;
    branding?: DocsBranding;
    details?: BundlerErrorDetails;
    config?: Config;
  }) {
    super(message);
    this.code = code;
    this.name = name;
    this.message = message;
    this.source = source;
    this.branding = branding;
    this.details = details;
    this.config = config;
  }
}

export type DocsBranding = {
  name?: string;
  logo?: {
    light?: string;
    dark?: string;
  };
};

export function logBundlerError(
  error: BundlerError,
  context?: BundlerErrorDetails,
) {
  const payload = {
    name: error.name,
    code: error.code,
    source: error.source,
    message: error.message,
    details: {
      ...context,
      ...error.details,
    },
  };

  if (error.code === 404) {
    console.warn(payload);
    return;
  }

  console.error(error);
}
