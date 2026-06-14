// 📁 tests/unit/validations.spec.ts
// ✅ Zod schemas are the shared contract between client forms and API routes.
//    These tests guard that contract: required fields, Persian messages, enums,
//    and the tricky optional-email / optional-comment escape hatches. 🧠

import { test, expect } from "@playwright/test";
import {
  loginPhoneSchema,
  registerSchema,
  verifySignupSchema,
  otpSchema,
} from "@/lib/validations/auth";
import { contactSchema } from "@/lib/validations/contact";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { reviewSchema } from "@/lib/validations/review";
import { profileSchema } from "@/lib/validations/profile";
import {
  DoctorServerSchema,
  ScheduleAddSchema,
  validate,
} from "@/lib/validations/doctor";

// ─── Auth ──────────────────────────────────────────────────────────────────

test.describe("loginPhoneSchema", () => {
  test("accepts a valid phone + password", () => {
    const r = loginPhoneSchema.safeParse({ phone: "09123456789", password: "pass1234" });
    expect(r.success).toBe(true);
  });
  test("rejects a short password with the Persian message", () => {
    const r = loginPhoneSchema.safeParse({ phone: "09123456789", password: "p1" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]?.message).toContain("۸");
  });
});

test.describe("registerSchema", () => {
  const base = {
    firstName: "علی",
    lastName: "رضایی",
    phone: "09123456789",
    password: "pass1234",
  };
  test("accepts a full valid registration (email omitted)", () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });
  test("accepts empty-string email via the .or(literal('')) escape", () => {
    expect(registerSchema.safeParse({ ...base, email: "" }).success).toBe(true);
  });
  test("rejects a non-Persian first name", () => {
    expect(registerSchema.safeParse({ ...base, firstName: "Ali" }).success).toBe(false);
  });
  test("rejects an invalid email when provided", () => {
    expect(registerSchema.safeParse({ ...base, email: "bad" }).success).toBe(false);
  });
});

test.describe("verifySignupSchema + otpSchema", () => {
  test("verifySignup requires a 5-digit otp on top of registration", () => {
    const ok = verifySignupSchema.safeParse({
      firstName: "علی",
      lastName: "رضایی",
      phone: "09123456789",
      password: "pass1234",
      otp: "12345",
    });
    expect(ok.success).toBe(true);
  });
  test("otpSchema rejects non-5-digit codes", () => {
    expect(otpSchema.safeParse({ otp: "12345" }).success).toBe(true);
    expect(otpSchema.safeParse({ otp: "123" }).success).toBe(false);
  });
});

// ─── Contact ─────────────────────────────────────────────────────────────────

test.describe("contactSchema", () => {
  const valid = {
    fullName: "علی رضایی",
    requestType: "support" as const,
    phone: "09123456789",
    message: "این یک پیام آزمایشی به اندازه کافی طولانی است",
  };
  test("accepts a valid message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  test("rejects an unknown request type", () => {
    expect(contactSchema.safeParse({ ...valid, requestType: "hack" }).success).toBe(false);
  });
  test("rejects a too-short message (<10 chars)", () => {
    expect(contactSchema.safeParse({ ...valid, message: "کوتاه" }).success).toBe(false);
  });
  test("rejects a >500 char message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "ا".repeat(501) }).success).toBe(false);
  });
  test("accepts an empty optional email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
  });
});

// ─── Newsletter ──────────────────────────────────────────────────────────────

test.describe("newsletterSchema", () => {
  test("accepts a valid email, rejects an invalid one", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

// ─── Review ──────────────────────────────────────────────────────────────────

test.describe("reviewSchema", () => {
  test("accepts rating 1-5 + recommendation enum", () => {
    expect(reviewSchema.safeParse({ rating: 5, recommendation: "recommend" }).success).toBe(true);
  });
  test("rejects rating out of bounds", () => {
    expect(reviewSchema.safeParse({ rating: 0, recommendation: "recommend" }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: 6, recommendation: "recommend" }).success).toBe(false);
  });
  test("rejects an invalid recommendation", () => {
    expect(reviewSchema.safeParse({ rating: 3, recommendation: "maybe" }).success).toBe(false);
  });
  test("caps comment length at 1000", () => {
    const long = { rating: 3, recommendation: "recommend", comment: "x".repeat(1001) };
    expect(reviewSchema.safeParse(long).success).toBe(false);
  });
});

// ─── Profile ─────────────────────────────────────────────────────────────────

test.describe("profileSchema", () => {
  const valid = { firstName: "علی", lastName: "رضایی", phone: "09123456789" };
  test("accepts minimal valid profile", () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });
  test("accepts gender empty-string sentinel", () => {
    expect(profileSchema.safeParse({ ...valid, gender: "" }).success).toBe(true);
  });
  test("rejects an out-of-enum gender", () => {
    expect(profileSchema.safeParse({ ...valid, gender: "other" }).success).toBe(false);
  });
  test("rejects an invalid national code", () => {
    expect(profileSchema.safeParse({ ...valid, nationalCode: "123" }).success).toBe(false);
  });
});

// ─── Doctor (server) ─────────────────────────────────────────────────────────

test.describe("DoctorServerSchema", () => {
  const valid = {
    name: "دکتر علی رضایی",
    specialty: "قلب و عروق",
    experience: 10,
    medicalCode: "12345",
    city: "تهران",
    address: "خیابان آزادی، پلاک ۱۲۳، طبقه دوم",
    gender: "male" as const,
    visitFee: 250000,
    contact: { phone: "", website: "", instagram: "" },
  };
  test("accepts a valid doctor + applies defaults", () => {
    const r = DoctorServerSchema.safeParse(valid);
    expect(r.success).toBe(true);
    // 🔧 defaults filled in by Zod
    if (r.success) {
      expect(r.data.hasInPersonVisit).toBe(true);
      expect(r.data.acceptedInsurances).toEqual([]);
      expect(r.data.about).toBe("");
    }
  });
  test("rejects experience > 70", () => {
    expect(DoctorServerSchema.safeParse({ ...valid, experience: 71 }).success).toBe(false);
  });
  test("rejects a non-numeric medical code", () => {
    expect(DoctorServerSchema.safeParse({ ...valid, medicalCode: "12a4" }).success).toBe(false);
  });
  test("rejects a website not starting with http", () => {
    const bad = { ...valid, contact: { phone: "", website: "ftp://x", instagram: "" } };
    expect(DoctorServerSchema.safeParse(bad).success).toBe(false);
  });
});

test.describe("ScheduleAddSchema", () => {
  test("accepts a date + at least one HH:MM slot", () => {
    expect(ScheduleAddSchema.safeParse({ date: "1403/10/24", times: ["09:00"] }).success).toBe(true);
  });
  test("rejects empty times array", () => {
    expect(ScheduleAddSchema.safeParse({ date: "1403-10-24", times: [] }).success).toBe(false);
  });
  test("rejects a malformed time", () => {
    expect(ScheduleAddSchema.safeParse({ date: "1403-10-24", times: ["9am"] }).success).toBe(false);
  });
});

// ─── validate() helper ───────────────────────────────────────────────────────

test.describe("validate() — flattens Zod issues to { path: message }", () => {
  test("returns typed data on success", () => {
    const r = validate(reviewSchema, { rating: 4, recommendation: "recommend" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.rating).toBe(4);
  });
  test("returns a keyed error record on failure", () => {
    const r = validate(reviewSchema, { rating: 99, recommendation: "nope" });
    expect(r.success).toBe(false);
    if (!r.success) {
      // 🗝️ keys are dot-joined field paths
      expect(Object.keys(r.errors)).toContain("recommendation");
    }
  });
});
