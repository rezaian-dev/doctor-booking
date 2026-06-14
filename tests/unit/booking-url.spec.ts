// 📁 tests/unit/booking-url.spec.ts
// 🔗 The booking URL builders are the single source of truth for the confirm/payment
//    hand-off. We assert correct encoding (Persian labels!) and param completeness. ✨

import { test, expect } from "@playwright/test";
import { buildConfirmUrl, buildPaymentUrl } from "@/lib/booking/url";

const confirm = {
  doctorId: "507f1f77bcf86cd799439011",
  date: "1404-12-13",
  time: "11:00",
  displayDate: "۱۳ اسفند ۱۴۰۴",
  displayTime: "۱۱:۰۰",
};

test.describe("buildConfirmUrl", () => {
  test("targets /booking/confirm and carries every param", () => {
    const url = buildConfirmUrl(confirm);
    expect(url.startsWith("/booking/confirm?")).toBe(true);

    const qs = new URLSearchParams(url.split("?")[1]);
    expect(qs.get("doctorId")).toBe(confirm.doctorId);
    expect(qs.get("date")).toBe(confirm.date);
    expect(qs.get("time")).toBe(confirm.time);
    // 🇮🇷 Persian labels survive the round-trip after decoding
    expect(qs.get("displayDate")).toBe(confirm.displayDate);
    expect(qs.get("displayTime")).toBe(confirm.displayTime);
  });

  test("percent-encodes Persian text (no raw spaces in the raw string)", () => {
    const url = buildConfirmUrl(confirm);
    expect(url).not.toContain(" "); // ✅ spaces become %20/+
  });
});

test.describe("buildPaymentUrl", () => {
  test("targets /booking/payment and adds patientName", () => {
    const url = buildPaymentUrl({ ...confirm, patientName: "علی رضایی" });
    expect(url.startsWith("/booking/payment?")).toBe(true);

    const qs = new URLSearchParams(url.split("?")[1]);
    expect(qs.get("patientName")).toBe("علی رضایی");
    expect(qs.get("doctorId")).toBe(confirm.doctorId);
  });
});
