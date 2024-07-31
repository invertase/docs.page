import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./app/**/*.{ts,tsx}"],
	darkMode: ["class", '[data-theme="dark"]'],
	theme: {
		extend: {
			maxWidth: {
				"8xl": "90rem",
			},
			fontFamily: {
				sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
				mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
			},
			colors: {
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					light: "hsl(var(--primary-lighter) / <alpha-value>)",
				},
				background: {
					DEFAULT: "hsl(var(--background) / <alpha-value>)",
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		// Custom tailwind plugin to enable targetting prose inline code.
		plugin(({ addVariant }) => {
			addVariant(
				"prose-inline-code",
				'&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))',
			);
		}),
	],
};
