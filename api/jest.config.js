export default {
    testEnvironment: "jest-environment-node",
    globals: {
        extensionsToTreatAsEsm: [".ts"],
        "ts-jest": {
            useESM: true,
            tsconfig: "jest.tsconfig.json"
        },
    },
    transform: {
        "^.+\\.(ts|tsx|js|jsx)?$": "ts-jest",
        //"^.+\\.tsx?$": "ts-jest",
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    // preset: "ts-jest",
    preset: 'ts-jest/presets/default-esm', // or other ESM presets
    transformIgnorePatterns: [],
    testTimeout: 15000
};
