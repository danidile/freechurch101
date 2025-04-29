import type { Config } from "jest"; // keep this for Jest config typing
import { config as dotenvConfig } from "dotenv"; // rename this one

dotenvConfig({ path: ".env.local" }); // now no conflict

dotenvConfig({ path: ".env.local" }); // now no conflict

import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.ts"], // 👈 keep this
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config); // ✅ only this export

module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.test.json" },
    ],
  },
  testEnvironment: "jsdom", // Ensure this is set to jsdom
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Other Jest configurations
};
