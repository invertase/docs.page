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
  purge: {
    enabled: true,
    content: ["./src/**/*.tsx"],
  },
  theme: {
    extend: {
      screens: {
        desktop: "940px",
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
