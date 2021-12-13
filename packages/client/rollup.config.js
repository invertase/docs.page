import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "./dist/bundle.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/bundle.es.js",
      format: "es",
    },
  ],
  plugins: [typescript()],
};
