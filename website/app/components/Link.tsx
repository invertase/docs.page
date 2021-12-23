import React from 'react';
import { usePreviewMode } from '~/utils/local-preview-mode';


interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
    href: string;
}

export default function Link(props: LinkProps) {
    if (isExternalLink(props.href)) {
        return <ExternalLink {...props} />;
    }

    const previewMode = usePreviewMode()

    if (previewMode.enabled) {
        return <a {...props} />;
    }

    return (<a {...props} />);
}

/**
 * Simple component which opens links in a new tab.
 */
export function ExternalLink(props: React.HTMLProps<HTMLAnchorElement>): JSX.Element {
    return <a {...props} target="_blank" rel="noopener" />;
}

export function isExternalLink(link: string): boolean {
    return link.startsWith('http://') || link.startsWith('https://');
}

/**
 * Links beginning with a `#` are considered hash links.
 */
export function isHashLink(link: string): boolean {
    return link.startsWith('#');
}