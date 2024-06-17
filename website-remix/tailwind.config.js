import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', ...defaultTheme.fontFamily.sans],
        display: ['"Cal Sans"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
        },
        background: {
          DEFAULT: 'hsl(var(--background) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
