import { defineConfig } from '@playwright/test';
export default defineConfig({
  reporter: [['html', { open: 'never' }]], // generate HTML report, do not open automatically
  timeout: 30000, // run tests in parallel
  expect: {
    timeout: 5000, // default timeout for expect assertions
  },
  // ...
  use: {
    headless: true, // run tests in headless mode
    trace: 'retain-on-failure', // record traces on first retry of each test
    ignoreHTTPSErrors: true, // ignore HTTPS errors
  },
});
