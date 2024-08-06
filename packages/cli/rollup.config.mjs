import typescript from "rollup-plugin-typescript2";

export default [
	{
		input: "./src/cli.ts",
		output: [
			{
				file: "./dist/cli.cjs.js",
				format: "cjs",
			},
		],
		plugins: [typescript()],
	},
	{
		input: "./src/index.ts",
		output: [
			{
				file: "./dist/bundle.cjs.js",
				format: "cjs",
			},
			{
				file: "dist/bundle.js",
				format: "es",
			},
		],
		plugins: [typescript()],
	},
];
