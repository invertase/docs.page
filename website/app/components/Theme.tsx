import Color from 'color';
import { useDocumentationContext } from '~/context';
import { defaultConfig } from '~/utils/config';

type Variant = 'base' | 'dark' | 'light';

// TODO pass config
export function Theme() {
  const theme = useDocumentationContext().config.theme;

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

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          const root = document.documentElement;
          root.style.setProperty('--theme-color', '${variants.base}');
          root.style.setProperty('--theme-color-dark', '${variants.dark}');
          root.style.setProperty('--theme-color-light', '${variants.light}');
          root.style.setProperty('--docsearch-primary-color', '--var(--theme-color)');
      `,
      }}
    />
  );
}
