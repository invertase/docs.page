import React, { CSSProperties } from 'react';
import validDataUrl from 'valid-data-url';
import { usePageContent, useSlugProperties } from '../hooks';
import { leadingSlash } from '../utils';
import { PageContent } from '../utils/content';
import { SlugProperties } from '../utils/properties';
import { isExternalLink } from './Link';

export function Image(
  props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
) {
  const properties = useSlugProperties();
  const content = usePageContent();

  if (!properties || !content) {
    throw new Error(
      'Image component must be a child of SlugPropertiesContext & PageContentContext',
    );
  }

  const style: CSSProperties = {
    height: sizeToProperty(props.height),
    width: sizeToProperty(props.width),
  };

  return (
    <img
      {...props}
      style={style}
      src={getImageSrc(properties, props.src)}
      alt={props.alt ?? ''}
      loading="lazy"
    />
  );
}

function sizeToProperty(size: string | number | undefined) {
  if (!size) return 'inherit';
  if (typeof size === 'number') return size;
  return parseInt(size);
}

export function getImageSrc(properties: SlugProperties, src: string) {
  if (isExternalLink(src) || validDataUrl(src)) {
    return src;
  }

  return `https://raw.githubusercontent.com/${properties.owner}/${properties.repository}/${
    properties.ref
  }/docs${leadingSlash(src)}`;
}
