// 📁 playwright.config.ts
// 🎭 Single config, three projects — clean separation of concerns:
//    • unit → pure logic, NO server, NO DB. Runs anywhere, instantly. 🧠
//    • api  → HTTP contract tests against route handlers (needs live server). 🌐
//    • e2e  → real browser journeys (needs live server + Mongo + Redis + seed). 🖥️
//
// Run a single layer:  npx playwright test --project=unit
//                      npx playwright test --project=api
//                      npx playwright test --project=e2e

import { defineConfig, devices } from "@playwright/test";

// 🌍 Base URL of the running Next.js app (override via env for CI / staging)
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

// 🚦 Only spin up the dev server when browser/api layers are requested.
//    Unit runs must stay hermetic — no port binding, no Mongo, no Redis.
const ONLY_UNIT = process.env.PW_ONLY_UNIT === "1";

export default defineConfig({
  // 🗂️ All specs live under tests/, split by layer folder
  testDir: "./tests",

  // ⛔ Fail the build if someone leaves test.only in source (CI safety)
  forbidOnly: !!process.env.CI,

  // 🔁 Flaky-guard: retry twice on CI, never locally (flakes must be visible)
  retries: process.env.CI ? 2 : 0,

  // 🧵 Parallel files; single worker on CI keeps DB-touching specs deterministic.
  //    🛡️ Spread conditionally instead of assigning `undefined` — required under
  //    exactOptionalPropertyTypes (omitting the key lets Playwright pick its default).
  fullyParallel: true,
  ...(process.env.CI ? { workers: 1 } : {}),

  // 📊 Rich local report + machine-readable CI artifacts
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }], ["list"]]
    : [["html", { open: "never" }], ["list"]],

  // ⏱️ Generous per-test ceiling; assertions get their own tighter budget
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: BASE_URL,
    // 🔍 Capture artifacts only on failure to keep runs fast
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // 🇮🇷 App is Persian/RTL — pin locale + Tehran TZ so date logic is stable
    locale: "fa-IR",
    timezoneId: "Asia/Tehran",
  },

  projects: [
    // ── 1) Pure logic ──────────────────────────────────────────────────────
    // No browser, no server. The fastest, most reliable safety net. ✅
    {
      name: "unit",
      testDir: "./tests/unit",
      use: {}, // 🚫 no browser context needed
    },

    // ── 2) API contract ────────────────────────────────────────────────────
    // Exercises route handlers over real HTTP via Playwright's request fixture.
    {
      name: "api",
      testDir: "./tests/api",
      use: { baseURL: BASE_URL },
    },

    // ── 3) Browser E2E ─────────────────────────────────────────────────────
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: { ...devices["Desktop Chrome"], baseURL: BASE_URL },
    },
  ],

  // 🚀 Auto-boot the app for api/e2e. Skipped entirely for unit-only runs.
  ...(ONLY_UNIT
    ? {}
    : {
        webServer: {
          // ⚙️ `start` (prod) is more representative; swap to `dev` while iterating
          command: "npm run start",
          url: BASE_URL,
          timeout: 120_000,
          reuseExistingServer: !process.env.CI,
        },
      }),
});
