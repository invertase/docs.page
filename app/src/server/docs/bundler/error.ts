export class BundlerError extends Error {
  code: number;
  name: string;
  source?: string;
  branding?: DocsBranding;

  constructor({
    code,
    name,
    message,
    source,
    branding,
  }: {
    code: number;
    name: string;
    message: string;
    source?: string;
    branding?: DocsBranding;
  }) {
    super(message);
    this.code = code;
    this.name = name;
    this.message = message;
    this.source = source;
    this.branding = branding;
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
