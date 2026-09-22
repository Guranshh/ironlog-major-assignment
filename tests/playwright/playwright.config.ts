import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";
import fs from "fs";
import path from "path";

const authDir = path.resolve(".auth"); // where the saved admin login is kept

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir); // create .auth the first time
  console.log(".auth directory created");
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // tests share one database, so run them one after another
  forbidOnly: !!process.env.CI, // fail on CI if a test.only was left in
  retries: process.env.CI ? 2 : 0, // retry flaky tests on CI only
  workers: 1,
  reporter: [["list"]],
  expect: { timeout: 10000 }, // dev mode builds pages on first visit, so allow 10 seconds
  use: {
    baseURL: "http://localhost:3002",
    trace: "on-first-retry",
    testIdAttribute: "data-test-id", // the course uses data-test-id, not data-testid
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ }, // logs into admin once
    {
      name: "chromium",
      testDir: "./tests/admin",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3002", // admin app
      },
      dependencies: process.env.CI ? ["setup"] : [],
    },
    {
      name: "chromium",
      testDir: "./tests/web",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001", // web app
      },
      dependencies: process.env.CI ? ["setup"] : [],
    },
  ],

  webServer: process.env.CI
    ? [
        {
          reuseExistingServer: true,
          command: "pnpm start:admin",
          url: "http://localhost:3002",
        },
        {
          reuseExistingServer: true,
          command: "pnpm start:web",
          url: "http://localhost:3001",
        },
      ]
    : undefined, // locally we start the apps ourselves with pnpm dev
});