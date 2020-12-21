const round = num =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');
const rem = px => `${round(px / 16)}rem`;

module.exports = {
  darkMode: 'class',
  purge: ['./src/**/*.tsx', './src/**/*.ts', '.src/**/*.css'],
  theme: {
    rotate: {
      270: '270deg',
    },
    extend: {
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
      },
      screens: {
        desktop: '940px',
      },
      opacity: {
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            'nav.toc ol > li::before': {
              content: '"#"',
              color: 'var(--theme-color)',
              fontWeight: 700,
            },
            'nav a': {
              textDecoration: 'none',
              color: 'black !important',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            'nav.toc ol > li a': {
              fontWeight: 700,
            },
            'nav.toc ol > li > ol > li a': {
              fontWeight: 300,
            },
            'nav.toc h3': {
              margin: 0,
            },
            'nav.toc span[role="img"]': {
              marginRight: rem(0.5),
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
            'h1, h2': {
              borderBottom: '1px solid',
              paddingBottom: rem(16),
              borderColor: theme('colors.gray.200'),
            },
            'table thead th, table tbody td': {
              padding: rem(1),
            },
            'a, a code': {
              color: 'var(--theme-color)',
              '&:hover': {
                color: 'var(--theme-color-light)',
              },
            },
          },
        },
        dark: {
          // https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
          css: {
            color: theme('colors.gray.200'),
            'h1, h2, h3, h4, h5, h6, strong, b, u, th, td': {
              color: theme('colors.gray.200'),
            },
            'h1 code, h2 code, h3 code, h4 code, h5 code, h6 code': {
              color: theme('colors.gray.300'),
            },
            blockquote: {
              borderColor: 'var(--theme-color)',
              color: theme('colors.gray.200'),
            },
            'nav a': {
              color: 'white !important',
            },
            'h1, h2': {
              borderColor: theme('colors.gray.700'),
            },
            code: {
              backgroundColor: theme('colors.gray.700'),
              color: theme('colors.gray.200'),
            },
            'pre code': {
              backgroundColor: 'inherit',
            },
            'a, a code': {
              color: 'var(--theme-color)',
              '&:hover': {
                color: 'var(--theme-color-light)',
              },
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
