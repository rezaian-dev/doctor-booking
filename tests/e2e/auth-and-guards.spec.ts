// 📁 tests/e2e/auth-and-guards.spec.ts
// 🔐 Auth surface: login form validation (no real credentials needed) + the proxy
//    route guards that protect /admin and /profile. These prove the security
//    boundary without seeding an admin user. 🛡️
//
// ⚠️ Requires the live stack. Run with: --project=e2e

import { test, expect } from "@playwright/test";

test.describe("Login form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
  });

  test("shows the phone + password fields", async ({ page }) => {
    await expect(page.getByPlaceholder("09123456789")).toBeVisible();
    await expect(page.getByPlaceholder(/رمز عبور/)).toBeVisible();
  });

  test("rejects an invalid phone format", async ({ page }) => {
    await page.getByPlaceholder("09123456789").fill("12345");
    await page.getByPlaceholder(/رمز عبور/).fill("pass1234");
    await page.getByRole("button", { name: /^ورود$/ }).click();
    // 🚫 Client-side Zod (loginPhoneSchema) blocks with a Persian message
    await expect(page.getByText(/شماره|نامعتبر/).first()).toBeVisible();
  });

  test("rejects a too-short password", async ({ page }) => {
    await page.getByPlaceholder("09123456789").fill("09123456789");
    await page.getByPlaceholder(/رمز عبور/).fill("p1");
    await page.getByRole("button", { name: /^ورود$/ }).click();
    await expect(page.getByText(/رمز|۸/).first()).toBeVisible();
  });
});

test.describe("Route guards (proxy.ts)", () => {
  test("anonymous /admin is redirected to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("anonymous /admin/doctors is redirected to login", async ({ page }) => {
    await page.goto("/admin/doctors");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("anonymous /profile is redirected to login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("the banned page is always reachable (escape hatch)", async ({ page }) => {
    const res = await page.goto("/auth/banned");
    expect(res?.status()).toBeLessThan(400);
  });
});
