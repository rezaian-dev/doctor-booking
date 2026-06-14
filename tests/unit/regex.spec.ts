// 📁 tests/unit/regex.spec.ts
// 🔤 The regex registry is the security/UX boundary for EVERY form + API in the
//    app. One wrong anchor silently lets bad data through — so we pin each pattern
//    with both positive and negative cases. 🛡️

import { test, expect } from "@playwright/test";
import { REGEX, isValidPersianName } from "@/lib/validations/regex";

test.describe("PHONE — Iranian mobile (09xxxxxxxxx)", () => {
  test("accepts a valid 11-digit mobile", () => {
    expect(REGEX.PHONE.test("09123456789")).toBe(true);
  });
  test("rejects wrong length / prefix / non-digits", () => {
    expect(REGEX.PHONE.test("0912345678")).toBe(false); // 🔴 10 digits
    expect(REGEX.PHONE.test("9123456789")).toBe(false); // 🔴 missing leading 0
    expect(REGEX.PHONE.test("08123456789")).toBe(false); // 🔴 wrong prefix
    expect(REGEX.PHONE.test("0912345678a")).toBe(false); // 🔴 letter
  });
});

test.describe("PHONE_CONTACT — landline with optional dash", () => {
  test("accepts dashed and undashed landline numbers", () => {
    expect(REGEX.PHONE_CONTACT.test("021-12345678")).toBe(true);
    expect(REGEX.PHONE_CONTACT.test("02112345678")).toBe(true);
  });
});

test.describe("PASSWORD — ≥8 chars, ≥1 letter + ≥1 digit", () => {
  test("accepts strong passwords (latin or persian letters)", () => {
    expect(REGEX.PASSWORD.test("pass1234")).toBe(true);
    expect(REGEX.PASSWORD.test("Aa1!aaaa")).toBe(true);
    expect(REGEX.PASSWORD.test("رمز12345")).toBe(true); // 🇮🇷 \p{L} covers Persian
  });
  test("rejects weak passwords", () => {
    expect(REGEX.PASSWORD.test("short1")).toBe(false); // 🔴 < 8
    expect(REGEX.PASSWORD.test("password")).toBe(false); // 🔴 no digit
    expect(REGEX.PASSWORD.test("12345678")).toBe(false); // 🔴 no letter
  });
});

test.describe("EMAIL + EMAIL_OPT", () => {
  test("EMAIL validates a normal address and rejects malformed", () => {
    expect(REGEX.EMAIL.test("user@example.com")).toBe(true);
    expect(REGEX.EMAIL.test("user@example")).toBe(false); // 🔴 no TLD
    expect(REGEX.EMAIL.test("@example.com")).toBe(false);
  });
  test("EMAIL_OPT additionally accepts empty string", () => {
    expect(REGEX.EMAIL_OPT.test("")).toBe(true);
    expect(REGEX.EMAIL_OPT.test("user@example.com")).toBe(true);
    expect(REGEX.EMAIL_OPT.test("nope")).toBe(false);
  });
});

test.describe("NATIONAL_CODE — exactly 10 digits", () => {
  test("validates length strictly", () => {
    expect(REGEX.NATIONAL_CODE.test("1234567890")).toBe(true);
    expect(REGEX.NATIONAL_CODE.test("123456789")).toBe(false); // 🔴 9
    expect(REGEX.NATIONAL_CODE.test("12345678901")).toBe(false); // 🔴 11
  });
  test("NATIONAL_CODE_OPT allows empty", () => {
    expect(REGEX.NATIONAL_CODE_OPT.test("")).toBe(true);
  });
});

test.describe("OTP / MEDICAL_CODE — 5 digits", () => {
  test("accepts five digits only", () => {
    expect(REGEX.OTP.test("12345")).toBe(true);
    expect(REGEX.OTP.test("1234")).toBe(false);
    expect(REGEX.OTP.test("123456")).toBe(false);
    expect(REGEX.OTP.test("12a45")).toBe(false);
  });
});

test.describe("MONGO_ID — 24 hex chars", () => {
  test("accepts a real ObjectId shape, rejects junk", () => {
    expect(REGEX.MONGO_ID.test("507f1f77bcf86cd799439011")).toBe(true);
    expect(REGEX.MONGO_ID.test("507f1f77bcf86cd79943901")).toBe(false); // 🔴 23
    expect(REGEX.MONGO_ID.test("zzzf1f77bcf86cd799439011")).toBe(false); // 🔴 non-hex
  });
});

test.describe("JALALI_DATE — strict YYYY-MM-DD", () => {
  test("accepts zero-padded valid dates", () => {
    expect(REGEX.JALALI_DATE.test("1404-12-13")).toBe(true);
    expect(REGEX.JALALI_DATE.test("1403-01-01")).toBe(true);
  });
  test("rejects out-of-range or unpadded dates", () => {
    expect(REGEX.JALALI_DATE.test("1404-13-01")).toBe(false); // 🔴 month 13
    expect(REGEX.JALALI_DATE.test("1404-00-10")).toBe(false); // 🔴 month 0
    expect(REGEX.JALALI_DATE.test("1404-12-32")).toBe(false); // 🔴 day 32
    expect(REGEX.JALALI_DATE.test("1404-1-1")).toBe(false); // 🔴 not padded
  });
});

test.describe("JALALI_DATE_FLEX — slash or dash", () => {
  test("accepts both separators from Persian date pickers", () => {
    expect(REGEX.JALALI_DATE_FLEX.test("1403-10-24")).toBe(true);
    expect(REGEX.JALALI_DATE_FLEX.test("1403/10/24")).toBe(true);
  });
});

test.describe("TIME_SLOT — HH:MM 24h", () => {
  test("accepts valid times, rejects overflow", () => {
    expect(REGEX.TIME_SLOT.test("00:00")).toBe(true);
    expect(REGEX.TIME_SLOT.test("23:59")).toBe(true);
    expect(REGEX.TIME_SLOT.test("24:00")).toBe(false); // 🔴 hour 24
    expect(REGEX.TIME_SLOT.test("12:60")).toBe(false); // 🔴 minute 60
    expect(REGEX.TIME_SLOT.test("9:30")).toBe(false); // 🔴 not padded
  });
});

test.describe("INSTAGRAM handle", () => {
  test("accepts word chars + dots up to 30, rejects illegal chars", () => {
    expect(REGEX.INSTAGRAM.test("dr.ali_clinic")).toBe(true);
    expect(REGEX.INSTAGRAM.test("a".repeat(31))).toBe(false); // 🔴 too long
    expect(REGEX.INSTAGRAM.test("has space")).toBe(false);
  });
});

test.describe("isValidPersianName — ≥2 real chars after stripping ZWNJ", () => {
  test("accepts Persian names including ZWNJ-joined ones", () => {
    expect(isValidPersianName("علی")).toBe(true);
    expect(isValidPersianName("محمد رضا")).toBe(true); // internal space ok
    expect(isValidPersianName("می‌لاد")).toBe(true); // ZWNJ inside
  });
  test("rejects latin, digits, and too-short input", () => {
    expect(isValidPersianName("Ali")).toBe(false); // 🔴 latin
    expect(isValidPersianName("ا")).toBe(false); // 🔴 1 real char
    expect(isValidPersianName("a1")).toBe(false); // 🔴 not persian
    expect(isValidPersianName("  ")).toBe(false); // 🔴 whitespace only
  });
});
