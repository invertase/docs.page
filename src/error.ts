import { SlugProperties } from "./properties";
import { isExternalLink } from "./components/Link";

export class RenderError {
  public static repositoryNotFound(properties: SlugProperties) {
    return new RenderError(404, properties);
  }

  public static pageNotFound(properties: SlugProperties) {
    return new RenderError(404, properties);
  }

  public static serverError(properties: SlugProperties) {
    return new RenderError(500, properties);
  }

  public readonly statusCode: number;
  public readonly properties: SlugProperties;

  private constructor(statusCode: number, properties?: SlugProperties) {
    this.statusCode = statusCode;
    this.properties = properties;
  }
}

export function redirect(link: string, properties?: SlugProperties) {
  let destination: string;

  if (!properties || isExternalLink(link)) {
    destination = link;
  } else {
    if (!link.startsWith("/")) {
      link = `/${link}`;
    }

    destination = `/${properties.base}${link}`;
  }

  return {
    redirect: {
      destination,
      permanent: true,
    },
    // TODO: Is this used on redirect?
    revalidate: 3600,
  };
}
