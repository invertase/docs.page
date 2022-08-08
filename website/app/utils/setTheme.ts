import Color from 'color';

export function setTheme(theme: string): void {
  let color: Color;
  try {
    color = Color(theme);
  } catch {
    color = Color('#00bcd4');
  }

  const variants = {
    base: color.hex().toString(),
    dark: color.darken(0.2).hex().toString(),
    light: color.lighten(0.2).hex().toString(),
  };

  const root = document.documentElement;
  root.style.setProperty('--theme-color', `${variants.base}`);
  root.style.setProperty('--theme-color-dark', `${variants.dark}`);
  root.style.setProperty('--theme-color-light', `${variants.light}`);
  root.style.setProperty('--docsearch-primary-color', '--var(--theme-color)');
}
