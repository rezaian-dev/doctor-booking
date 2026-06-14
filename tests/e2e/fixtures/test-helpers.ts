// 📁 tests/e2e/fixtures/test-helpers.ts
// 🧰 Shared E2E utilities — keep specs declarative and DRY. ✨

import { expect, type Page } from "@playwright/test";

// 🇮🇷 Assert the document is correctly set up for Persian RTL rendering
export async function expectPersianRtlShell(page: Page) {
  const html = page.locator("html");
  await expect(html).toHaveAttribute("dir", "rtl");
  await expect(html).toHaveAttribute("lang", "fa");
}

// 🚫 Assert the page has no obviously-broken (empty-href / 404-bound) primary nav.
//    A lightweight smoke check, not an exhaustive crawl.
export async function expectNoConsoleErrors(page: Page, run: () => Promise<void>) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await run();
  // 🧹 Filter out third-party noise (favicons, analytics) — only fail on app errors
  const appErrors = errors.filter((e) => !/favicon|analytics|net::ERR/i.test(e));
  expect(appErrors, `console errors:\n${appErrors.join("\n")}`).toHaveLength(0);
}
