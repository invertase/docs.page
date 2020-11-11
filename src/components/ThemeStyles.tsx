import React, { useContext } from "react";
import Color from "color";
import { ConfigContext, defaultConfig } from "../config";

function ThemeStyles() {
  const config = useContext(ConfigContext);

  if (!config) {
    throw new Error("ThemeStyles component must a child of ConfigContext");
  }

  let color: Color;
  try {
    color = Color(config.theme);
  } catch (e) {
    color = Color(defaultConfig.theme);
  }

  return (
    <style jsx>{`
      :root {
        --theme-color: ${config.theme};
        --theme-color-dark: ${color.darken(0.2)};
        --theme-color-light: ${color.lighten(0.2)};
      }
    `}</style>
  );
}

export { ThemeStyles };
