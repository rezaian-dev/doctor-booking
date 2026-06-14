// 📁 tests/api/doctors.api.spec.ts
// 🌐 HTTP contract for GET /api/doctors (public listing) + a quick guard sweep over
//    protected admin routes. Asserts response *shape* and pagination invariants
//    rather than exact data, so it stays green against any seeded dataset. 🩺
//
// ⚠️ Requires the live stack (Next server + Mongo). Run with: --project=api

import { test, expect } from "@playwright/test";

test.describe("GET /api/doctors — public listing", () => {
  test("returns { doctors[], totalPages } with the right types", async ({ request }) => {
    const res = await request.get("/api/doctors");
    expect(res.ok()).toBe(true);

    const body = await res.json();
    expect(Array.isArray(body.doctors)).toBe(true);
    expect(typeof body.totalPages).toBe("number");
  });

  test("each doctor exposes the documented fields", async ({ request }) => {
    const body = await (await request.get("/api/doctors")).json();
    // 🛡️ Only assert when the seed actually has doctors
    test.skip(body.doctors.length === 0, "no seeded doctors to assert on");

    const d = body.doctors[0];
    for (const key of ["_id", "name", "specialty", "isAvailable", "avgRating", "reviewCount"]) {
      expect(d).toHaveProperty(key);
    }
    // 📊 rating is a number, availability a boolean
    expect(typeof d.avgRating).toBe("number");
    expect(typeof d.isAvailable).toBe("boolean");
  });

  test("respects the page-size cap (≤ 5 per page)", async ({ request }) => {
    const body = await (await request.get("/api/doctors?page=1")).json();
    expect(body.doctors.length).toBeLessThanOrEqual(5);
  });

  test("an out-of-range page returns an empty list, not an error", async ({ request }) => {
    const res = await request.get("/api/doctors?page=9999");
    expect(res.ok()).toBe(true);
    expect((await res.json()).doctors).toEqual([]);
  });

  test("a nonsense search yields zero results cleanly", async ({ request }) => {
    const body = await (await request.get("/api/doctors?search=zzzznomatchqqq")).json();
    expect(body.doctors).toEqual([]);
  });
});

test.describe("Anonymous access is not privileged", () => {
  // 🔒 /api/profile is a hard-protected route → must reject (non-200) without a session.
  test("GET /api/profile is rejected without auth", async ({ request }) => {
    const res = await request.get("/api/profile", { maxRedirects: 0 });
    expect(res.status()).not.toBe(200);
  });

  // 🧠 /api/auth/me and /api/user/me are *session probes*: by design they answer
  //    200 with `{ user: null }` when logged out (so the header can fetch per-visitor
  //    without 401 noise). The real security contract is "no session leaks" — assert
  //    that, not the status code.
  for (const path of ["/api/auth/me", "/api/user/me"]) {
    test(`GET ${path} returns a null user when anonymous`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.user).toBeNull(); // 🚫 no authenticated identity exposed
    });
  }
});
