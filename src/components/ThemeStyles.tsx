import React from 'react';
import Color from 'color';
import { defaultConfig } from '../utils/projectConfig';
import { useConfig } from '../hooks';

type Variant = 'base' | 'dark' | 'light';

/**
 * Once the configuration options are fetched for the page,
 * this component injects a few CSS classes into the scope based
 * on the provided theme.
 */
function ThemeStyles(): JSX.Element {
  const config = useConfig();

  if (!config) {
    throw new Error('ThemeStyles component must a child of ConfigContext');
  }

  let color: Color;
  try {
    color = Color(config.theme);
  } catch (e) {
    color = Color(defaultConfig.theme);
  }

  const variants: { [key in Variant]: string } = {
    base: color.hex().toString(),
    dark: color.darken(0.2).hex().toString(),
    light: color.lighten(0.2).hex().toString(),
  };

  const styles = [];

  Object.keys(variants).forEach(key => {
    const variant = key === 'base' ? '' : `-${key}`;

    styles.push(`.text-theme-color${variant} {
      color: var(--theme-color${variant});
    }`);

    styles.push(`.hover\\:text-theme-color${variant}:hover {
      color: var(--theme-color${variant});
    }`);

    styles.push(`.bg-theme-color${variant} {
      background-color: var(--theme-color${variant});
    }`);
  });

  return (
    <style global jsx>{`
      :root {
        --theme-color: ${variants.base};
        --theme-color-dark: ${variants.dark};
        --theme-color-light: ${variants.light};
        --docsearch-primary-color: var(--theme-color);
      }

      ${styles.join(`\n`)}

      #nprogress .bar {
        background: var(--theme-color) !important;
      }
    `}</style>
  );
}

export { ThemeStyles };
