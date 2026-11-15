import { defineConfig } from "@playwright/test";

// Set PW_PORT to point the tests at a dev server that is already running.
const PORT = Number(process.env.PW_PORT ?? 3000);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // The installed Chrome: no browser download, and WebGL works headless.
    channel: "chrome",
  },
  // A dev build on purpose: only dev publishes the renderer counters on
  // window.__r3f, which the budget test reads.
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}/portfolio`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
