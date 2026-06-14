// 📁 tests/unit/jalaali.spec.ts
// 📅 Jalali helpers feed booking availability, schedule sorting and every visible
//    date label. A drift here corrupts appointments — so we pin exact conversions
//    against known Nowruz anchors and assert the deterministic (Intl-free) paths. 🧠

import { test, expect } from "@playwright/test";
import {
  dateToJalaliStr,
  jalaliStrToLabel,
  jalaliStrToDate,
  isPastJalaliDate,
  toFarsiTime,
  jalaliDisplayDate,
  jalaliDateTimeFa,
  todayJalali,
  JALALI_MONTHS,
  JALALI_DAYS,
} from "@/hooks/use-jalaali";

test.describe("dateToJalaliStr — Gregorian → Jalali YYYY-MM-DD", () => {
  test("Nowruz 1403 anchor: 2024-03-20 → 1403-01-01", () => {
    // 🌱 First day of spring / Persian new year — a fixed, well-known anchor
    expect(dateToJalaliStr(new Date(2024, 2, 20))).toBe("1403-01-01");
  });
  test("zero-pads single-digit month and day", () => {
    const s = dateToJalaliStr(new Date(2024, 2, 20));
    expect(s).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

test.describe("jalaliStrToLabel — readable weekday label", () => {
  test("1403-01-01 → چهارشنبه ۱ فروردین", () => {
    expect(jalaliStrToLabel("1403-01-01")).toBe("چهارشنبه ۱ فروردین");
  });
  test("output starts with a valid weekday and ends with a valid month", () => {
    const label = jalaliStrToLabel("1403-01-01");
    // 🧱 Build the matcher from the source tuples — index-safe (no possibly-undefined)
    expect(label).toMatch(new RegExp(`^(${JALALI_DAYS.join("|")}) `));
    expect(label).toMatch(new RegExp(` (${JALALI_MONTHS.join("|")})$`));
  });
});

test.describe("jalaliStrToDate — round-trips back to Gregorian", () => {
  test("1403-01-01 → 2024-03-20", () => {
    const d = jalaliStrToDate("1403-01-01");
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(2); // March (0-indexed)
    expect(d.getDate()).toBe(20);
  });
});

test.describe("isPastJalaliDate — lexicographic comparison vs today", () => {
  test("a far-past date is past", () => {
    expect(isPastJalaliDate("1300-01-01")).toBe(true);
  });
  test("a far-future date is not past", () => {
    expect(isPastJalaliDate("1500-01-01")).toBe(false);
  });
  test("empty string is treated as not-past", () => {
    expect(isPastJalaliDate("")).toBe(false);
  });
});

test.describe("toFarsiTime — minutes padded, hours intentionally NOT padded", () => {
  test("strips the hour's leading zero (parseInt) but pads the minute to 2 digits", () => {
    // 🧠 Contract: hour is parseInt'd so "09" → "۹"; minute is always zero-padded.
    expect(toFarsiTime("09:30")).toBe("۹:۳۰");
    expect(toFarsiTime("12:0")).toBe("۱۲:۰۰"); // 🔢 lone minute padded
    expect(toFarsiTime("8:5")).toBe("۸:۰۵");
  });
});

test.describe("jalaliDisplayDate — '۱ فروردین ۱۴۰۳' style", () => {
  test("renders day, month name and year in Persian digits", () => {
    expect(jalaliDisplayDate(new Date(2024, 2, 20))).toBe("۱ فروردین ۱۴۰۳");
  });
});

test.describe("jalaliDateTimeFa — deterministic Tehran wall-clock (UTC+3:30)", () => {
  test("shifts a UTC instant into Tehran time and formats it", () => {
    // 05:00Z + 3:30 = 08:30 Tehran → 1403-10-25
    const iso = "2025-01-14T05:00:00.000Z";
    expect(jalaliDateTimeFa(iso)).toBe("۲۵ دی ۱۴۰۳، ۰۸:۳۰");
  });
  test("offset can push the calendar day forward across midnight", () => {
    // 21:00Z + 3:30 = 00:30 next-day Tehran
    const iso = "2025-01-13T21:00:00.000Z";
    expect(jalaliDateTimeFa(iso)).toBe("۲۵ دی ۱۴۰۳، ۰۰:۳۰");
  });
  test("year:false drops the year segment", () => {
    const iso = "2025-01-14T05:00:00.000Z";
    expect(jalaliDateTimeFa(iso, { year: false })).toBe("۲۵ دی، ۰۸:۳۰");
  });
  test("time:false drops the time segment", () => {
    const iso = "2025-01-14T05:00:00.000Z";
    expect(jalaliDateTimeFa(iso, { time: false })).toBe("۲۵ دی ۱۴۰۳");
  });
});

test.describe("todayJalali — shape + Tehran timezone contract", () => {
  test("returns a well-formed date + time (not value-pinned, since it's 'now')", () => {
    const { date, time } = todayJalali();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(time).toMatch(/^\d{2}:\d{2}$/);
  });
});
