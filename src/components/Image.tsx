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

  return <img {...props} src={getImageSrc(properties, props.src)} alt={props.alt ?? ''} loading="lazy" />;
}

export function getImageSrc(properties: SlugProperties, src: string) {
  if (isExternalLink(src) || validDataUrl(src)) {
    return src;
  }

  return `https://raw.githubusercontent.com/${properties.owner}/${properties.repository}/${properties.ref}/docs${src}`;
}
