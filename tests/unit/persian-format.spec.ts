// 📁 tests/unit/persian-format.spec.ts
// 🔢 Locks the deterministic Persian-digit formatter — the SSR/CSR hydration
//    guarantee depends on this producing byte-identical output everywhere. 🧠

import { test, expect } from "@playwright/test";
import { toFaDigits, formatFaNumber } from "@/lib/utils/persian-format";

test.describe("toFaDigits — ASCII → Persian digit mapping", () => {
  test("maps every digit 0-9 to its Persian glyph", () => {
    expect(toFaDigits("0123456789")).toBe("۰۱۲۳۴۵۶۷۸۹");
  });

  test("accepts a number input and stringifies it", () => {
    expect(toFaDigits(42)).toBe("۴۲");
  });

  test("leaves non-digit characters untouched", () => {
    // ✅ separators, letters, slashes survive verbatim
    expect(toFaDigits("1404-12-13")).toBe("۱۴۰۴-۱۲-۱۳");
    expect(toFaDigits("ساعت 9")).toBe("ساعت ۹");
  });

  test("is idempotent on already-Persian strings", () => {
    expect(toFaDigits("۱۲۳")).toBe("۱۲۳");
  });
});

test.describe("formatFaNumber — grouping + sign + Persian digits", () => {
  test("groups thousands with U+066C by default", () => {
    expect(formatFaNumber(1_000_000)).toBe("۱٬۰۰۰٬۰۰۰");
  });

  test("respects grouping:false", () => {
    expect(formatFaNumber(1_000_000, { grouping: false })).toBe("۱۰۰۰۰۰۰");
  });

  test("preserves a negative sign", () => {
    expect(formatFaNumber(-2500)).toBe("-۲٬۵۰۰");
  });

  test("truncates fractional input (integers only)", () => {
    expect(formatFaNumber(1234.99)).toBe("۱٬۲۳۴");
  });

  test("formats zero cleanly", () => {
    expect(formatFaNumber(0)).toBe("۰");
  });

  test("does not group 3-digit numbers", () => {
    expect(formatFaNumber(999)).toBe("۹۹۹");
  });
});
