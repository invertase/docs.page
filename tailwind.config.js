const round = num =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');
const rem = px => `${round(px / 16)}rem`;

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  purge: ['./src/**/*.{tsx,ts,css}'],
  theme: {
    rotate: {
      270: '270deg',
    },
    extend: {
      colors: {
        docs: {
          background: 'var(--background)',
        },
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            'a:hover': {
              opacity: '0.75',
            },
            img: {
              marginLeft: 'auto',
              marginRight: 'auto',
            },
            code: {
              paddingLeft: rem(4),
              paddingRight: rem(4),
              paddingTop: rem(2),
              paddingBottom: rem(2),
              backgroundColor: theme('colors.gray.100'),
              borderRadius: rem(4),
              fontWeight: 400,
            },
            'blockquote p:first-of-type::before, blockquote p:last-of-type::after, code::before, code::after': {
              display: 'none',
            },
          },
        },
        dark: {
          // https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
          css: {
            color: theme('colors.gray.200'),
            'a, code a': {
              color: theme('colors.gray.200'),
            },
            'h1, h2, h3, h4, h5, h6, strong, b, u, th, td, li:before': {
              color: theme('colors.gray.200'),
            },
            'h1 code, h2 code, h3 code, h4 code, h5 code, h6 code': {
              color: theme('colors.gray.300'),
            },
            blockquote: {
              borderColor: 'var(--theme-color)',
              color: theme('colors.gray.200'),
            },
            code: {
              backgroundColor: theme('colors.gray.700'),
              color: theme('colors.gray.200'),
            },
            'pre code': {
              backgroundColor: 'inherit',
            },
          },
        },
      }),
    },
  },
  variants: {
    display: ({ variants }) => [...variants('display'), 'dark'],
    typography: ({ variants }) => [...variants('typography'), 'dark'],
  },
  plugins: [require('@tailwindcss/typography')],
};
