import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./src/**/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      maxWidth: {
        "8xl": "90rem",
      },
      fontFamily: {
        sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          light: "hsl(var(--primary-lighter) / <alpha-value>)",
        },
        background: {
          DEFAULT: "hsl(var(--background) / <alpha-value>)",
        },
        brand: {
          0: "#FFFFFF",
          50: "#FDFAE8",
          100: "#FBF4D1",
          150: "#F9EFBA",
          200: "#F7E9A3",
          300: "#F4DF74",
          400: "#F0D446",
          500: "#ECC918",
          600: "#BFA213",
          700: "#917C0F",
          800: "#64550A",
          850: "#4D4208",
          900: "#362F06",
          950: "#201B03",
          1000: "#090801",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // Custom tailwind plugin to enable targetting prose inline code.
    plugin(({ addVariant }) => {
      addVariant(
        "prose-inline-code",
        '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))',
      );
    }),
  ],
};
export default config;
