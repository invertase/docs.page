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
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
        heading: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        zinc: {
          ...defaultTheme.colors.zinc,
          /* Align with `--color-design-black` (#040406), not default Tailwind zinc-950. */
          950: "hsl(var(--color-design-black) / <alpha-value>)",
        },
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
        marketing: {
          accent: "hsl(var(--marketing-accent) / <alpha-value>)",
          "accent-bright":
            "hsl(var(--marketing-accent-bright) / <alpha-value>)",
          "accent-emphasis":
            "hsl(var(--marketing-accent-emphasis) / <alpha-value>)",
          "hero-glow": "hsl(var(--marketing-hero-glow) / <alpha-value>)",
          "hero-frame-border":
            "hsl(var(--marketing-hero-frame-border) / <alpha-value>)",
          "hero-video-tint":
            "hsl(var(--marketing-hero-video-tint) / <alpha-value>)",
          "hero-video-tint-dark":
            "hsl(var(--marketing-hero-video-tint-dark) / <alpha-value>)",
          "pill-foreground":
            "hsl(var(--marketing-pill-foreground) / <alpha-value>)",
          "pill-foreground-dark":
            "hsl(var(--marketing-pill-foreground-dark) / <alpha-value>)",
          "feature-divider":
            "hsl(var(--marketing-feature-divider) / <alpha-value>)",
          "feature-divider-dark":
            "hsl(var(--marketing-feature-divider-dark) / <alpha-value>)",
          "cell-hover": "hsl(var(--marketing-cell-hover) / <alpha-value>)",
          "cell-ring-offset":
            "hsl(var(--marketing-cell-ring-offset) / <alpha-value>)",
          "feature-icon": "hsl(var(--marketing-feature-icon) / <alpha-value>)",
          "feature-icon-bright":
            "hsl(var(--marketing-feature-icon-bright) / <alpha-value>)",
          "platform-border":
            "hsl(var(--marketing-platform-border) / <alpha-value>)",
          "platform-border-dark":
            "hsl(var(--marketing-platform-border-dark) / <alpha-value>)",
          "platform-title":
            "hsl(var(--marketing-platform-title) / <alpha-value>)",
          "platform-desc":
            "hsl(var(--marketing-platform-desc) / <alpha-value>)",
          "platform-gradient-from":
            "hsl(var(--marketing-platform-gradient-from) / <alpha-value>)",
          "platform-gradient-via":
            "hsl(var(--marketing-platform-gradient-via) / <alpha-value>)",
          "platform-inner-dark":
            "hsl(var(--marketing-platform-inner-dark) / <alpha-value>)",
          "testimonial-avatar-bg":
            "hsl(var(--marketing-testimonial-avatar-bg) / <alpha-value>)",
          "testimonial-avatar-text":
            "hsl(var(--marketing-testimonial-avatar-text) / <alpha-value>)",
          "step-rail": "hsl(var(--marketing-step-rail) / <alpha-value>)",
          "step-badge-border":
            "hsl(var(--marketing-step-badge-border) / <alpha-value>)",
          "step-badge-fill-dark":
            "hsl(var(--marketing-step-badge-fill-dark) / <alpha-value>)",
          success: "hsl(var(--marketing-success) / <alpha-value>)",
          "success-bright":
            "hsl(var(--marketing-success-bright) / <alpha-value>)",
          "button-cta": "hsl(var(--marketing-button-cta) / <alpha-value>)",
          "button-cta-hover":
            "hsl(var(--marketing-button-cta-hover) / <alpha-value>)",
          "ghost-hover-foreground":
            "hsl(var(--marketing-ghost-hover-foreground) / <alpha-value>)",
          "nav-link-hover":
            "hsl(var(--marketing-nav-link-hover) / <alpha-value>)",
          "surface-muted":
            "hsl(var(--marketing-surface-muted) / <alpha-value>)",
          "surface-muted-hover":
            "hsl(var(--marketing-surface-muted-hover) / <alpha-value>)",
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
    plugin(({ addVariant }) => {
      addVariant(
        "prose-inline-code",
        '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))',
      );
    }),
  ],
};
export default config;
