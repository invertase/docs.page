export class BundlerError extends Error {
  code: number;
  links?: { title: string; url: string }[];

  constructor({
    code,
    name,
    message,
    cause,
    links,
  }: {
    code: number;
    name: string;
    message: string;
    cause?: string;
    links?: { title: string; url: string }[];
  }) {
    super(message);
    this.code = code;
    this.name = name;
    this.message = message;
    this.cause = cause;
    this.links = links;
  }
}
