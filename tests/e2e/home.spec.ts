// 📁 tests/e2e/home.spec.ts
// 🏠 Homepage smoke + Persian RTL shell. Cheap, high-signal: if this breaks, the
//    whole app is down or the layout regressed. 🖥️
//
// ⚠️ Requires the live stack. Run with: --project=e2e

import { test, expect } from "@playwright/test";
import { expectPersianRtlShell } from "./fixtures/test-helpers";

test.describe("Homepage", () => {
  test("loads with the correct Persian title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/نوبت‌دهی آنلاین پزشک/);
  });

  test("renders a Persian RTL document shell", async ({ page }) => {
    await page.goto("/");
    await expectPersianRtlShell(page);
  });

  test("shows the primary search entry point", async ({ page }) => {
    await page.goto("/");
    // 🔎 The hero search is the core CTA — assert a search box exists
    await expect(page.getByRole("searchbox").or(page.getByPlaceholder(/جستجو|پزشک|تخصص/))).toBeVisible();
  });

  test("links through to the doctors listing", async ({ page }) => {
    await page.goto("/");
    // 🔗 "محبوب‌ترین پزشکان" section has a view-all link to /doctors
    const viewAll = page.getByRole("link", { name: /پزشکان|مشاهده/ }).first();
    await viewAll.click();
    await expect(page).toHaveURL(/\/doctors/);
  });
});
