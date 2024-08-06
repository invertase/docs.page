import path from 'node:path';
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { vercelPreset } from "@vercel/remix/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
	resolve: {
		alias: {
			// Use source files from the local workspace rather than dist files.
			"@docs.page/cli": path.resolve(__dirname, "../packages/cli/src/index.ts"),
		},
	},
	plugins: [
		remix({
			presets: [vercelPreset()],
			future: {
				unstable_singleFetch: false, // Not working on Vercel
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
		tsconfigPaths(),
	],
});
