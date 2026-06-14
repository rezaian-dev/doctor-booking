// 📁 tests/unit/misc-utils.spec.ts
// 🧩 A grab-bag of small pure utilities that each back a visible feature:
//    active-filter badge, appointment slot label, ProfileCard mapper, SEO metadata
//    builder, and the cn() class merger. All deterministic, all worth locking. ✨

import { test, expect } from "@playwright/test";
import { countActiveFilters } from "@/lib/utils/filter-count";
import { formatSlot, JALALI_MONTHS } from "@/lib/utils/appointments";
import { toProfileCardData, NO_IMAGE } from "@/lib/utils/profile-card";
import { pageMetadata } from "@/lib/utils/seo";
import { cn } from "@/lib/utils/cn";
import type { FilterState } from "@/hooks/use-filter-params";

// 🏭 Build a FilterState inline (avoids importing nuqs-backed EMPTY_FILTERS)
const filters = (over: Partial<FilterState> = {}): FilterState => ({
  search: "",
  specialty: [],
  city: [],
  insurance: [],
  experience: [],
  availability: [],
  gender: "",
  ...over,
});

// ─── countActiveFilters ──────────────────────────────────────────────────────

test.describe("countActiveFilters — chip counter (search excluded)", () => {
  test("zero when nothing is selected", () => {
    expect(countActiveFilters(filters())).toBe(0);
  });
  test("sums array groups + gender", () => {
    const f = filters({ specialty: ["cardiology", "neurology"], city: ["tehran"], gender: "male" });
    expect(countActiveFilters(f)).toBe(4); // 2 + 1 + 1
  });
  test("ignores the free-text search field", () => {
    expect(countActiveFilters(filters({ search: "علی" }))).toBe(0);
  });
});

// ─── formatSlot ──────────────────────────────────────────────────────────────

test.describe("formatSlot — '13 اسفند · ساعت 11:0' style label", () => {
  test("maps month index to the right Jalali month name", () => {
    const out = formatSlot("1404-12-13", "11:00");
    // 🗓️ month 12 → اسفند (the 12th entry of JALALI_MONTHS); ! is safe on a 12-tuple
    expect(out).toContain(JALALI_MONTHS[11]!);
    expect(out).toContain("ساعت");
  });
  test("starts with the day number", () => {
    expect(formatSlot("1404-01-05", "09:30").startsWith("5 ")).toBe(true);
  });
});

// ─── toProfileCardData ───────────────────────────────────────────────────────

test.describe("toProfileCardData — doctor → ProfileCard mapper", () => {
  const doctor = {
    name: "دکتر علی رضایی",
    specialty: "قلب",
    photo: "",
    medicalCode: "12345",
    address: "تهران",
    about: "متخصص قلب",
    avgRating: 4.5,
    reviewCount: 12,
  };

  test("maps core fields and falls back to NO_IMAGE for empty photo", () => {
    const data = toProfileCardData(doctor);
    expect(data.name).toBe(doctor.name);
    expect(data.image).toBe(NO_IMAGE); // 🖼️ empty photo → placeholder
    expect(data.rating).toBe(4.5);
    expect(data.reviewsCount).toBe(12);
    expect(data.bio).toBe("متخصص قلب");
  });

  test("keeps a real photo when present", () => {
    const data = toProfileCardData({ ...doctor, photo: "/uploads/x.jpg" });
    expect(data.image).toBe("/uploads/x.jpg");
  });

  test("overrides win over mapped defaults", () => {
    const data = toProfileCardData(doctor, { name: "نام جایگزین" });
    expect(data.name).toBe("نام جایگزین");
  });
});

// ─── pageMetadata ────────────────────────────────────────────────────────────

test.describe("pageMetadata — Next Metadata builder", () => {
  test("always sets title + fa_IR OpenGraph locale", () => {
    const meta = pageMetadata({ title: "صفحه اصلی" });
    expect(meta.title).toBe("صفحه اصلی");
    expect(meta.openGraph?.locale).toBe("fa_IR");
  });

  test("omits optional keys when not provided (exactOptionalProps-safe)", () => {
    const meta = pageMetadata({ title: "x" });
    expect("description" in meta).toBe(false);
    expect("alternates" in meta).toBe(false);
  });

  test("wires canonical into alternates when provided", () => {
    const meta = pageMetadata({ title: "x", canonical: "https://dr.example/" });
    expect(meta.alternates?.canonical).toBe("https://dr.example/");
  });
});

// ─── cn ──────────────────────────────────────────────────────────────────────

test.describe("cn — clsx + tailwind-merge", () => {
  test("joins truthy classes and drops falsy ones", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
  test("later tailwind utility wins on conflict", () => {
    // 🎨 tailwind-merge dedupes conflicting padding utilities, last wins
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
