module.exports = {
  darkMode: 'class',
  // TODO breaks dark:hover:bg-X- in Sidebar.tsx
  // purge: {
  //   enabled: true,
  //   content: ["./src/**/*.tsx"],
  // },
  theme: {
    rotate: {
      270: '270deg',
    },
    extend: {
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '5rem',
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
              marginRight: '0.5rem',
            },
            img: {
              marginLeft: 'auto',
              marginRight: 'auto',
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
            a: {
              color: 'var(--theme-color)',
              '&:hover': {
                color: 'var(--theme-color-light)',
              },
            },
            'p code, li code, td code': {
              color: 'var(--theme-color)',
            },
            'nav a': {
              color: 'white !important',
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
