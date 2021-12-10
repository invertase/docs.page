module.exports = {
  mode: 'jit',
  purge: ['./app/**/*.{ts,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
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
  plugins: [],
};
