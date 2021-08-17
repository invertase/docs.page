import { leadingSlash } from './index';
import { Properties, SlugProperties } from './properties';
import { isExternalLink } from '../components/Link';
import { GetStaticPropsResult } from 'next';
import { PageContent } from './content';

export enum ErrorType {
  // The given repository was not found.
  repositoryNotFound,
  // An mdx file within the repository was not found.
  pageNotFound,
  // A server error occurred (e.g. rendering error).
  serverError,
  // Error was thrown from the error page override.
  errorPage,
}

export interface IRenderError {
  statusCode: number;
  errorType: ErrorType;
  properties?: SlugProperties;
  error?: string;
}

export class RenderError {
  public static repositoryNotFound(properties: Properties): RenderError {
    return new RenderError(404, ErrorType.repositoryNotFound, properties);
  }

  public static pageNotFound(properties: Properties): RenderError {
    return new RenderError(404, ErrorType.pageNotFound, properties);
  }

  public static serverError(properties: Properties): RenderError {
    return new RenderError(500, ErrorType.serverError, properties);
  }

  public static error(statusCode: number, errorType: ErrorType, error: Error): RenderError {
    return new RenderError(statusCode, errorType, undefined, error);
  }

  public readonly statusCode: number;
  public readonly errorType: ErrorType;
  public readonly properties?: Properties;
  public readonly error?: Error;

  private constructor(
    statusCode: number,
    errorType: ErrorType,
    properties?: Properties,
    error?: Error,
  ) {
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.properties = properties;
    this.error = error;
  }

  public toObject(content?: PageContent): IRenderError {
    return {
      statusCode: this.statusCode,
      errorType: this.errorType,
      properties: this.properties?.toObject(content) ?? null,
      error: this.error?.message ?? null,
    };
  }
}

export function redirect(link: string, properties?: Properties): GetStaticPropsResult<never> {
  let destination: string;

  if (!properties || isExternalLink(link)) {
    // If it is an external link or the slug properties have not been provided,
    // redirect with the exact link.
    destination = link;
  } else {
    destination = `${properties.base}${leadingSlash(link)}`;
  }

  return {
    redirect: {
      destination,
      permanent: true,
    },
  };
}
