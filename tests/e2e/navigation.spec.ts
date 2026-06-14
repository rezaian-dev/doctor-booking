// 📁 tests/e2e/navigation.spec.ts
// 🧭 Every public (main) route should render with its own <title> and a 200.
//    Data-driven so adding a page is a one-line change. ✨
//
// ⚠️ Requires the live stack. Run with: --project=e2e

import { test, expect } from "@playwright/test";

// 🗺️ path → expected title fragment (from each page's exported metadata)
const PUBLIC_PAGES: Array<{ path: string; title: RegExp }> = [
  { path: "/", title: /نوبت‌دهی آنلاین پزشک/ },
  { path: "/doctors", title: /پزشک/ },
  { path: "/about-us", title: /درباره ما/ },
  { path: "/contact-us", title: /تماس با ما/ },
  { path: "/specialties", title: /تخصص|پزشک/ },
  { path: "/faq", title: /سوال|پرسش|متداول/ },
  { path: "/articles", title: /مقال/ },
];

for (const { path, title } of PUBLIC_PAGES) {
  test(`${path} responds 200 and has the right title`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status(), `HTTP status for ${path}`).toBeLessThan(400);
    await expect(page).toHaveTitle(title);
  });
}

test.describe("404 handling", () => {
  test("unknown route renders the not-found page (not a crash)", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-xyz");
    // 🧱 not-found.tsx shows readable Persian copy, not a stack trace
    await expect(page.locator("body")).toContainText(
      /در دسترس نیست|یافت نشد|پیدا نشد|بازگشت به صفحه اصلی|۴۰۴|404/,
    );
  });
});
