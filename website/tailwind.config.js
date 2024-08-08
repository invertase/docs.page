import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{ts,tsx}"],
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
          50: "#EAFAF4",
          100: "#D5F6EA",
          200: "#B0EDD7",
          300: "#86E4C1",
          400: "#5CDBAC",
          500: "#35D298",
          600: "#26AB7A",
          700: "#1D815C",
          800: "#14583E",
          900: "#092A1E",
          950: "#05150F",
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
        '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))'
      );
    }),
  ],
};
