// 📁 tests/api/contact.api.spec.ts
// 🌐 HTTP contract for POST /api/contact — the schema is shared with the client
//    form, so these tests double as a guard that server validation never drifts. 📬
//
// ⚠️ Requires the live stack (Next server + Mongo). Run with: --project=api

import { test, expect } from "@playwright/test";

const validMessage = {
  fullName: "علی رضایی",
  requestType: "support",
  phone: "09123456789",
  message: "این یک پیام آزمایشی به اندازه کافی طولانی برای عبور از اعتبارسنجی است",
};

test.describe("POST /api/contact", () => {
  test("201 on a valid submission", async ({ request }) => {
    const res = await request.post("/api/contact", { data: validMessage });
    expect(res.status()).toBe(201);
    expect((await res.json()).success).toBe(true);
  });

  test("400 + Persian error on a too-short message", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...validMessage, message: "کوتاه" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
    expect(body.details).toBeTruthy(); // 🧾 flattened Zod issues returned to client
  });

  test("400 on an unknown request type", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...validMessage, requestType: "definitely-not-allowed" },
    });
    expect(res.status()).toBe(400);
  });

  test("400 on an invalid phone number", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...validMessage, phone: "12345" },
    });
    expect(res.status()).toBe(400);
  });
});
