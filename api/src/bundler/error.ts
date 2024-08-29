export class BundlerError extends Error {
  code: number;
  name: string;
  source?: string;

  constructor({
    code,
    name,
    message,
    source,
  }: {
    code: number;
    name: string;
    message: string;
    source?: string;
  }) {
    super(message);
    this.code = code;
    this.name = name;
    this.message = message;
    this.source = source;
  }
}
