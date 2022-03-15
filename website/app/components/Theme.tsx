import Color from 'color';
import { useEffect } from 'react';
import { defaultConfig, ProjectConfig } from '~/utils/config';
import { setTheme } from '~/utils/setTheme';

type Variant = 'base' | 'dark' | 'light';

export function Theme({ config }: { config: ProjectConfig }) {
  const theme = config.theme;
  let color: Color;
  try {
    color = Color(theme);
  } catch {
    color = Color(defaultConfig.theme);
  }

  const variants: { [key in Variant]: string } = {
    base: color.hex().toString(),
    dark: color.darken(0.2).hex().toString(),
    light: color.lighten(0.2).hex().toString(),
  };

  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <script
      id="theme"
      dangerouslySetInnerHTML={{
        __html: `
        window.setTheme = () => {
          const root = document.documentElement;
          root.style.setProperty('--theme-color', '${variants.base}');
          root.style.setProperty('--theme-color-dark', '${variants.dark}');
          root.style.setProperty('--theme-color-light', '${variants.light}');
          root.style.setProperty('--docsearch-primary-color', '--var(--theme-color)');
        };
        window.setTheme();
      `,
      }}
    />
  );
}
