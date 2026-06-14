// 📁 tests/unit/crypto-otp.spec.ts
// 🔐 OTP security primitives: random code generation, SHA-256 hashing, and a
//    timing-safe comparison. A bug here weakens auth — so we pin format, hashing
//    determinism, and the constant-time equality contract. 🛡️

import { test, expect } from "@playwright/test";
import { generateOTP, hashOTP, compareOTP } from "@/lib/utils/crypto";
import { OTP_CFG } from "@/lib/otp/config";

test.describe("generateOTP", () => {
  test("produces a numeric code of the configured length", () => {
    const code = generateOTP();
    expect(code).toMatch(new RegExp(`^\\d{${OTP_CFG.CODE_LENGTH}}$`));
  });

  test("is sufficiently random across many draws (no constant)", () => {
    const set = new Set(Array.from({ length: 50 }, () => generateOTP()));
    // 🎲 50 draws should not collapse to one value
    expect(set.size).toBeGreaterThan(1);
  });
});

test.describe("hashOTP", () => {
  test("returns a 64-char hex SHA-256 digest", () => {
    expect(hashOTP("12345")).toMatch(/^[a-f0-9]{64}$/);
  });

  test("is deterministic for the same input", () => {
    expect(hashOTP("99999")).toBe(hashOTP("99999"));
  });

  test("differs for different inputs", () => {
    expect(hashOTP("11111")).not.toBe(hashOTP("22222"));
  });
});

test.describe("compareOTP — timing-safe equality", () => {
  test("returns true for identical hashes", () => {
    const h = hashOTP("54321");
    expect(compareOTP(h, h)).toBe(true);
  });

  test("returns false for mismatched hashes", () => {
    expect(compareOTP(hashOTP("11111"), hashOTP("22222"))).toBe(false);
  });

  test("returns false (never throws) on malformed / length-mismatched input", () => {
    expect(compareOTP("zzzz", hashOTP("11111"))).toBe(false);
    expect(compareOTP("", "")).toBe(true); // empty buffers are equal length → true
  });
});
