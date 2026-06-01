import { useDocPageContext } from "@/hooks/use-doc-page-context";
import Color from "color";
import Head from "next/head";

function parseColor(color?: string) {
  if (!color) {
    return undefined;
  }

  try {
    return Color(color).hex();
  } catch {
    return undefined;
  }
}

export function Preset() {
  const { bundle } = useDocPageContext();
  const preset = bundle.config.theme.preset;
  const theme = bundle.config.theme;

  const primaryLight = parseColor(theme.primaryLight ?? theme.primary);
  const primaryDark = parseColor(theme.primaryDark ?? theme.primary);
  const backgroundLight = parseColor(theme.backgroundLight);
  const backgroundDark = parseColor(theme.backgroundDark);

  return (
    <Head>
      <style key="theme-preset">
        {preset
          ? `
        ${preset.css}
        *, *::before, *::after {
          --font-sans: ${preset.build.fontSans} !important;
          --font-heading: ${preset.build.fontHeading} !important;
        }
      `
          : null}
        {primaryLight
          ? `:root:not(.dark) { --primary: ${primaryLight}; }`
          : null}
        {primaryDark ? `.dark { --primary: ${primaryDark}; }` : null}
        {backgroundLight
          ? `:root:not(.dark) { --background: ${backgroundLight}; }`
          : null}
        {backgroundDark ? `.dark { --background: ${backgroundDark}; }` : null}
      </style>
    </Head>
  );
}
