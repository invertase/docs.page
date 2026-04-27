import { useDocPageContext } from "@/hooks/use-doc-page-context";

export function Preset() {
  const { bundle } = useDocPageContext();
  const preset = bundle.config.theme.preset;

  if (!preset) {
    return null;
  }

  return (
    <style key="theme-preset">
      {`
        ${preset.css}
        *, *::before, *::after {
          --font-sans: ${preset.build.fontSans} !important;
          --font-heading: ${preset.build.fontHeading} !important;
        }
      `}
    </style>
  );
}
