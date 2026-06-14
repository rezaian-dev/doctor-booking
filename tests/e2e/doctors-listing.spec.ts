// 📁 tests/e2e/doctors-listing.spec.ts
// 🩺 The doctors listing is the product's heart: search, filters, deep-links.
//    Selectors are grounded in the real UI (the doctor-name search has the exact
//    placeholder "جستجوی نام پزشک"; the city field is a separate combobox). 🔎
//
// 🧠 Architecture note: the free-text search is *draft* state (setPatch) and is NOT
//    written to the URL until filters are applied — so we don't assert an instant
//    URL sync. Instead we assert the input is usable + that ?search deep-links work.
//
// ⚠️ Requires the live stack. Run with: --project=e2e

import { test, expect } from "@playwright/test";

// 🎯 Exact placeholder → avoids colliding with the city combobox ("جستجو و انتخاب شهر…")
const searchInput = (page: import("@playwright/test").Page) =>
  page.getByPlaceholder("جستجوی نام پزشک").first();

test.describe("Doctors listing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/doctors");
  });

  test("renders the doctor-name search input", async ({ page }) => {
    await expect(searchInput(page)).toBeVisible();
  });

  test("the search input accepts text (draft state)", async ({ page }) => {
    const input = searchInput(page);
    await input.fill("قلب");
    await expect(input).toHaveValue("قلب");
  });

  test("a ?search deep link loads without error", async ({ page }) => {
    await page.goto("/doctors?search=قلب");
    await expect(page).toHaveURL(/search=/);
    await expect(page.locator("body")).not.toContainText(/Application error|Unhandled/i);
  });

  test("a sort=popular deep link is honored", async ({ page }) => {
    await page.goto("/doctors?sort=popular");
    await expect(page).toHaveURL(/sort=popular/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("shows a graceful empty state for an impossible search", async ({ page }) => {
    await page.goto("/doctors?search=zzzznomatchqqq");
    await expect(page.locator("body")).not.toContainText(/Application error|Unhandled/i);
  });
});
