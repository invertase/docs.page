import { leadingSlash } from './index';
import { Properties, SlugProperties } from './properties';
import { isExternalLink } from '../components/Link';
import { GetServerSidePropsResult } from 'next';

export enum ErrorType {
  repositoryNotFound,
  pageNotFound,
  serverError,
}

export interface IRenderError {
  statusCode: number;
  errorType: ErrorType;
  properties: SlugProperties;
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

  public readonly statusCode: number;
  public readonly errorType: ErrorType;
  public readonly properties?: Properties;

  private constructor(statusCode: number, errorType: ErrorType, properties: Properties) {
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.properties = properties;
  }

  public toObject(): IRenderError {
    return {
      statusCode: this.statusCode,
      errorType: this.errorType,
      properties: this.properties.toObject(),
    };
  }
}

export function redirect(link: string, properties?: Properties): GetServerSidePropsResult<never> {
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
