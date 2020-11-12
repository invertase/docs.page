module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    content: ["./src/**/*.tsx"],
    options: {
      whitelist: ["dark-mode", "mode-dark"],
    },
  },
  theme: {
    extend: {
      screens: {
        "desktop": "940px"
      },
    },
    darkSelector: ".dark-mode",
    // TODO not working
    typography: (theme) => ({
      dark: {
        css: {
          h1: {
            color: theme("colors.gray.100"),
          },
        },
      },
    }),
  },
  variants: {
    backgroundColor: ({ variants }) => [...variants("backgroundColor"), "dark"],
    textColor: ({ variants }) => [...variants("textColor"), "dark"],
    borderColor: ({ variants }) => [...variants("borderColor"), "dark"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-dark-mode")(),
  ],
};
