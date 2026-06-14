// 📁 tests/api/newsletter.api.spec.ts
// 🌐 HTTP contract for POST /api/newsletter — validation, fresh subscribe, and the
//    idempotent "already subscribed" branch the UI relies on for its toast. 📧
//
// ⚠️ Requires the live stack (Next server + Mongo). Run with: --project=api

import { test, expect } from "@playwright/test";

test.describe("POST /api/newsletter", () => {
  test("400 on an invalid email", async ({ request }) => {
    const res = await request.post("/api/newsletter", { data: { email: "not-an-email" } });
    expect(res.status()).toBe(400);
  });

  test("201 on a brand-new subscription", async ({ request }) => {
    // 🎲 Unique address so the run is repeatable without DB cleanup
    const email = `pw_${Date.now()}@example.com`;
    const res = await request.post("/api/newsletter", { data: { email } });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.code).toBe("SUBSCRIBED");
  });

  test("200 + ALREADY_SUBSCRIBED on a duplicate", async ({ request }) => {
    const email = `pw_dup_${Date.now()}@example.com`;
    await request.post("/api/newsletter", { data: { email } }); // first time
    const res = await request.post("/api/newsletter", { data: { email } }); // again
    expect(res.status()).toBe(200);
    expect((await res.json()).code).toBe("ALREADY_SUBSCRIBED");
  });
});
