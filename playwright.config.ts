import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // frontend
  use: {
    baseURL: 'http://localhost:5173', // default target app
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'pnpm --filter=web dev', // start frontend dev server
      port: 5173, // wait until this port is open
      timeout: 60000, // max wait time
      reuseExistingServer: !process.env.CI, // useful in dev
    },
    {
      command: 'pnpm --filter=vue-web dev', // start frontend dev server
      port: 5174, // wait until this port is open
      timeout: 60000, // max wait time
      reuseExistingServer: !process.env.CI, // useful in dev
    },
    {
      command: 'pnpm --filter=svelte-web dev', // start frontend dev server
      port: 5175, // wait until this port is open
      timeout: 60000, // max wait time
      reuseExistingServer: !process.env.CI, // useful in dev
    },
  ],
  // backend
  globalSetup: require.resolve('./e2e-tests/global-setup.js'),
  globalTeardown: require.resolve('./e2e-tests/global-teardown.js'),
  testDir: './e2e-tests',
  timeout: 60e3,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'swr - chromium',
      testMatch: /.*swr\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5173' },
    },
    {
      name: 'react-query - chromium',
      testMatch: /.*react-query\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5173' },
    },
    {
      name: 'vue-query - chromium',
      testMatch: /.*vue-query\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5174' },
    },
    {
      name: 'svelte-query - chromium',
      testMatch: /.*svelte-query\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5175' },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
