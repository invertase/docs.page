import Color from 'color';

type Variant = 'base' | 'dark' | 'light';

// TODO pass config
export function Theme() {
  const theme = '#cf0202';

  let color: Color;
  try {
    color = Color(theme);
  } catch {
    // todo default theme
    color = Color(theme);
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
