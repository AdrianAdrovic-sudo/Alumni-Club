import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/testing/**/*.tests.ts"],
  clearMocks: true,
};

export default config;