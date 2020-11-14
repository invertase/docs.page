import { SlugProperties } from "./properties";
import { isExternalLink } from "./components/Link";

export type Error = {
    code: number;
    message: string;
    stack?: string;
};

export function repositoryNotFound(properties: SlugProperties): Error {
    return {
        code: 404,
        message: `The repository ${properties.owner}/${properties.repository} was not found.`,
    };
}

export function pageNotFound(properties: SlugProperties): Error {
    return {
        code: 404,
        message: `pageNotFound.`,
    };
}

export function renderError(properties: SlugProperties): Error {
    return {
        code: 500,
        message: `renderError.`,
    };
}

export function redirect(link: string, properties?: SlugProperties) {
    let destination: string;

    if (!properties || isExternalLink(link)) {
        destination = link;
    } else {
        if (!link.startsWith('/')) {
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