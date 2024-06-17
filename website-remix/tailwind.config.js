import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Cal Sans"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--theme-primary) / <alpha-value>)',
          light: 'hsl(var(--theme-primary-light) / <alpha-value>)',
          dark: 'hsl(var(--theme-primary-dark) / <alpha-value>)',
        },
        background: {
          light: 'hsl(var(--theme-background-light) / <alpha-value>)',
          dark: 'hsl(var(--theme-background-dark) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
