import type { Config } from "@/server/config";

export class BundlerError extends Error {
  code: number;
  name: string;
  source?: string;
  branding?: DocsBranding;
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
    config,
  }: {
    code: number;
    name: string;
    message: string;
    source?: string;
    branding?: DocsBranding;
    config?: Config;
  }) {
    super(message);
    this.code = code;
    this.name = name;
    this.message = message;
    this.source = source;
    this.branding = branding;
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

export function logBundlerError(error: BundlerError) {
  const payload = {
    name: error.name,
    code: error.code,
    source: error.source,
    message: error.message,
  };

  if (error.code === 404) {
    console.warn(payload);
    return;
  }

  console.error(error);
}
