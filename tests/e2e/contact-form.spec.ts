// 📁 tests/e2e/contact-form.spec.ts
// 📬 Contact form — client validation (Persian errors) + happy-path submit.
//    Selectors are grounded in the real component (#fullName / #phone / #message,
//    a Radix Select for requestType, and the "ارسال پیام" submit button). ✨
//
// ⚠️ Requires the live stack. Run with: --project=e2e

import { test, expect } from "@playwright/test";

// 🎯 The contact submit button — exact name avoids matching the footer's "ثبت ایمیل"
const submitBtn = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "ارسال پیام" });

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact-us");
  });

  test("blocks submit and shows Persian errors on an empty form", async ({ page }) => {
    await submitBtn(page).click();
    // 🚫 RHF + Zod surface at least one Persian validation message
    await expect(page.getByText(/الزامی|حداقل|نامعتبر/).first()).toBeVisible();
  });

  test("rejects a non-Persian name", async ({ page }) => {
    await page.locator("#fullName").fill("John");
    await submitBtn(page).click();
    // 🇮🇷 Schema message: "لطفاً فقط از حروف فارسی استفاده کنید"
    await expect(page.getByText(/فارسی/).first()).toBeVisible();
  });

  test("accepts a fully valid submission", async ({ page }) => {
    // 📝 Fill by stable ids (placeholders differ from labels in this form)
    await page.locator("#fullName").fill("علی رضایی");
    await page.locator("#phone").fill("09123456789");
    await page.locator("#message").fill("سلام، این یک پیام آزمایشی کاملاً معتبر و طولانی است.");

    // 🎛️ requestType is a Radix Select: open the trigger, then pick an option
    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "پشتیبانی" }).click();

    await submitBtn(page).click();
    // ✅ Success panel renders "پیام شما ارسال شد"
    await expect(page.getByText(/پیام شما ارسال شد|ارسال شد/).first()).toBeVisible({ timeout: 10_000 });
  });
});
