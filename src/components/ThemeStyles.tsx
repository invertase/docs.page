import React from 'react';
import Color from 'color';
import { defaultConfig } from '../utils/projectConfig';
import { useConfig } from '../hooks';

type Varient = 'base' | 'dark' | 'light';

/**
 * Once the configuration options are fetched for the page,
 * this component injects a few CSS classes into the scope based
 * on the provided theme.
 */
function ThemeStyles() {
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

  const varients: { [key in Varient]: string } = {
    base: color.hex().toString(),
    dark: color.darken(0.2).hex().toString(),
    light: color.lighten(0.2).hex().toString(),
  };

  const styles = [];

  Object.keys(varients).forEach(key => {
    const varient = key === 'base' ? '' : `-${key}`;

    styles.push(`.text-theme-color${varient} {
      color: var(--theme-color${varient});
    }`);

    styles.push(`.hover\\:text-theme-color${varient}:hover {
      color: var(--theme-color${varient});
    }`);

    styles.push(`.bg-theme-color${varient} {
      background-color: var(--theme-color${varient});
    }`);
  });

  return (
    <style global jsx>{`
      :root {
        --theme-color: ${varients.base};
        --theme-color-dark: ${varients.dark};
        --theme-color-light: ${varients.light};
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
