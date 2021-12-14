module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        docs: {
          // see app/components/Theme.tsx
          theme: 'var(--theme-color)',
        },
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
};
