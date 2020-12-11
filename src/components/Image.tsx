import React from 'react';
import validDataUrl from 'valid-data-url';
import { useSlugProperties } from '../hooks';
import { leadingSlash } from '../utils';
import { SlugProperties } from '../utils/properties';
import { isExternalLink } from './Link';

export function Image(
  props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
) {
  const properties = useSlugProperties();

  if (!properties) {
    throw new Error('Image component must be a child of SlugPropertiesContext');
  }

  let src = '';

  if (isExternalLink(props.src) || validDataUrl(props.src)) {
    src = props.src;
  } else {
    src = getRawGitHubFile(properties, leadingSlash(props.src));
  }

  return <img {...props} src={src} alt={props.alt ?? ''} />;
}

// Creates a path to a raw file on GitHub
function getRawGitHubFile(properties: SlugProperties, file: string) {
  return `https://raw.githubusercontent.com/${properties.owner}/${properties.repository}/${properties.ref}/docs${file}`;
}
