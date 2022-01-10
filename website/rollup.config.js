import commonJs from "@rollup/plugin-commonjs";
import jsonPlugin from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "api/build/index.js",
    output: {
        file: "api/build/index.js",
        format: "cjs"
    },
    plugins: [
        commonJs(),
        resolve({
            moduleDirectories: ["node_modules"]
        }),
        jsonPlugin()
    ]
};