/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

import { compilerOptions } from "./tsconfig.json";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  moduleFileExtensions: ["js", "ts", "mts"],
  extensionsToTreatAsEsm: [".ts", ".mts"],
  testMatch: ["./**/*.test.{mts,ts}"],
  transform: {
    "^.+\\.(ts|mts)$": [
      "ts-jest",
      {
        //useESM: true,
      },
    ],
  },
};
