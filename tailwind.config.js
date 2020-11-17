module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  // Dark mode: https://github.com/tailwindlabs/tailwindcss/pull/2279
  experimental: {
    darkModeVariant: true,
  },
  dark: "class",
  // TODO breaks dark:hover:bg-X- in Sidebar.tsx
  // purge: {
  //   enabled: true,
  //   content: ["./src/**/*.tsx"],
  // },
  theme: {
    extend: {
      fontFamily: {
        anton: ["Anton", "sans-serif"],
      },
      fontSize: {
        "7xl": "5rem",
        "8xl": "5rem",
      },
      screens: {
        desktop: "940px",
      },
      opacity: {
        10: "0.1",
        20: "0.2",
        30: "0.3",
        40: "0.4",
        60: "0.6",
        70: "0.7",
        80: "0.8",
        90: "0.9",
      },
    },
    typography: (theme) => ({
      dark: {
        // https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
        css: {
          color: theme("colors.gray.300"),
          h1: {
            color: theme("colors.gray.300"),
          },
          h2: {
            color: theme("colors.gray.300"),
          },
          h3: {
            color: theme("colors.gray.300"),
          },
          h4: {
            color: theme("colors.gray.300"),
          },
          h5: {
            color: theme("colors.gray.300"),
          },
          h6: {
            color: theme("colors.gray.300"),
          },
          blockquote: {
            borderColor: "var(--theme-color)",
            color: theme("colors.gray.300"),
          },
          a: {
            color: "var(--theme-color)",
            "&:hover": {
              color: "var(--theme-color-light)",
            },
          },
          "p code": {
            color: "var(--theme-color)",
          },
        },
      },
    }),
  },
  variants: {
    typography: ({ variants }) => [...variants("typography"), "dark"],
  },
  plugins: [require("@tailwindcss/typography")],
};
