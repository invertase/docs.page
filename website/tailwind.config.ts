import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./src/**/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      screens: {
        /** Burger menu breakpoint — keep in sync with `MARKETING_NAV_MIN_WIDTH_PX`. */
        marketingNav: "813px",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
        heading: ['"Lexend"', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        /* Neutrals: canonical Tailwind `neutral` ramp from tokens; `white` / `black` match design (#E7E8E9 / #040406). */
        neutral: {
          50: "hsl(var(--color-neutral-50) / <alpha-value>)",
          100: "hsl(var(--color-neutral-100) / <alpha-value>)",
          200: "hsl(var(--color-neutral-200) / <alpha-value>)",
          300: "hsl(var(--color-neutral-300) / <alpha-value>)",
          400: "hsl(var(--color-neutral-400) / <alpha-value>)",
          500: "hsl(var(--color-neutral-500) / <alpha-value>)",
          600: "hsl(var(--color-neutral-600) / <alpha-value>)",
          700: "hsl(var(--color-neutral-700) / <alpha-value>)",
          800: "hsl(var(--color-neutral-800) / <alpha-value>)",
          900: "hsl(var(--color-neutral-900) / <alpha-value>)",
          950: "hsl(var(--color-neutral-950) / <alpha-value>)",
        },
        white: "hsl(var(--color-invertase-white) / <alpha-value>)",
        black: "hsl(var(--color-design-black) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          light: "hsl(var(--primary-lighter) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        /* Primary brand: soft periwinkle (500 = #5368BD) — `bg-periwinkle-500`, etc. */
        periwinkle: {
          50: "hsl(var(--color-soft-periwinkle-50) / <alpha-value>)",
          100: "hsl(var(--color-soft-periwinkle-100) / <alpha-value>)",
          200: "hsl(var(--color-soft-periwinkle-200) / <alpha-value>)",
          300: "hsl(var(--color-soft-periwinkle-300) / <alpha-value>)",
          400: "hsl(var(--color-soft-periwinkle-400) / <alpha-value>)",
          500: "hsl(var(--color-soft-periwinkle-500) / <alpha-value>)",
          600: "hsl(var(--color-soft-periwinkle-600) / <alpha-value>)",
          700: "hsl(var(--color-soft-periwinkle-700) / <alpha-value>)",
          800: "hsl(var(--color-soft-periwinkle-800) / <alpha-value>)",
          900: "hsl(var(--color-soft-periwinkle-900) / <alpha-value>)",
          950: "hsl(var(--color-soft-periwinkle-950) / <alpha-value>)",
        },
        honey: {
          50: "hsl(var(--color-honey-50) / <alpha-value>)",
          100: "hsl(var(--color-honey-100) / <alpha-value>)",
          200: "hsl(var(--color-honey-200) / <alpha-value>)",
          300: "hsl(var(--color-honey-300) / <alpha-value>)",
          400: "hsl(var(--color-honey-400) / <alpha-value>)",
          500: "hsl(var(--color-honey-500) / <alpha-value>)",
          600: "hsl(var(--color-honey-600) / <alpha-value>)",
          700: "hsl(var(--color-honey-700) / <alpha-value>)",
          800: "hsl(var(--color-honey-800) / <alpha-value>)",
          900: "hsl(var(--color-honey-900) / <alpha-value>)",
          950: "hsl(var(--color-honey-950) / <alpha-value>)",
        },
        lavender: {
          50: "hsl(var(--color-lavender-50) / <alpha-value>)",
          100: "hsl(var(--color-lavender-100) / <alpha-value>)",
          200: "hsl(var(--color-lavender-200) / <alpha-value>)",
          300: "hsl(var(--color-lavender-300) / <alpha-value>)",
          400: "hsl(var(--color-lavender-400) / <alpha-value>)",
          500: "hsl(var(--color-lavender-500) / <alpha-value>)",
          600: "hsl(var(--color-lavender-600) / <alpha-value>)",
          700: "hsl(var(--color-lavender-700) / <alpha-value>)",
          800: "hsl(var(--color-lavender-800) / <alpha-value>)",
          900: "hsl(var(--color-lavender-900) / <alpha-value>)",
          950: "hsl(var(--color-lavender-950) / <alpha-value>)",
        },
        teal: {
          50: "hsl(var(--color-emerald-50) / <alpha-value>)",
          100: "hsl(var(--color-emerald-100) / <alpha-value>)",
          200: "hsl(var(--color-emerald-200) / <alpha-value>)",
          300: "hsl(var(--color-emerald-300) / <alpha-value>)",
          400: "hsl(var(--color-emerald-400) / <alpha-value>)",
          500: "hsl(var(--color-emerald-500) / <alpha-value>)",
          600: "hsl(var(--color-emerald-600) / <alpha-value>)",
          700: "hsl(var(--color-emerald-700) / <alpha-value>)",
          800: "hsl(var(--color-emerald-800) / <alpha-value>)",
          900: "hsl(var(--color-emerald-900) / <alpha-value>)",
          950: "hsl(var(--color-emerald-950) / <alpha-value>)",
        },
        red: {
          50: "hsl(var(--color-red-50) / <alpha-value>)",
          100: "hsl(var(--color-red-100) / <alpha-value>)",
          200: "hsl(var(--color-red-200) / <alpha-value>)",
          300: "hsl(var(--color-red-300) / <alpha-value>)",
          400: "hsl(var(--color-red-400) / <alpha-value>)",
          500: "hsl(var(--color-red-500) / <alpha-value>)",
          600: "hsl(var(--color-red-600) / <alpha-value>)",
          700: "hsl(var(--color-red-700) / <alpha-value>)",
          800: "hsl(var(--color-red-800) / <alpha-value>)",
          900: "hsl(var(--color-red-900) / <alpha-value>)",
          950: "hsl(var(--color-red-950) / <alpha-value>)",
        },
        coral: "hsl(var(--color-brand-coral-red) / <alpha-value>)",
        "warm-orange": "hsl(var(--color-brand-warm-orange) / <alpha-value>)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addVariant }) => {
      addVariant(
        "prose-inline-code",
        '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))',
      );
    }),
  ],
};
export default config;
