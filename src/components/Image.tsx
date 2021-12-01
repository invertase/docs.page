import React, { CSSProperties } from 'react';
import validDataUrl from 'valid-data-url';
import { usePageContent, usePreviewMode, useSlugProperties } from '../hooks';
import { leadingSlash } from '../utils';
import { PreviewMode } from '../utils/preview';
import { SlugProperties } from '../utils/properties';
import { isExternalLink } from './Link';

interface ImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  height?: string | number;
  width?: string | number;
  alt?: string;
  src?: string;
}

export function Image(props: ImageProps): JSX.Element {
  const properties = useSlugProperties();
  const content = usePageContent();

  if (!properties || !content) {
    throw new Error(
      'Image component must be a child of SlugPropertiesContext & PageContentContext',
    );
  }

  const previewMode = usePreviewMode();

  const style: CSSProperties = {
    height: sizeToProperty(props.height),
    width: sizeToProperty(props.width),
  };

  return (
    // Always remote images so we don't know sizes;
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      style={style}
      src={getImageSrc(properties, props.src, previewMode)}
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

export function getImageSrc(
  properties: SlugProperties,
  src: string,
  previewMode: PreviewMode,
): string {
  if (isExternalLink(src) || validDataUrl(src)) {
    return src;
  }
  if (previewMode.enabled) {
    return previewMode.imageUrls[src] || '';
  }

  return `https://raw.githubusercontent.com/${properties.source.owner}/${
    properties.source.repository
  }/${properties.source.ref}/docs${leadingSlash(src)}`;
}
