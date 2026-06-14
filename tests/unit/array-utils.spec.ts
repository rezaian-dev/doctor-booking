// 📁 tests/unit/array-utils.spec.ts
// 🔄 Tiny but load-bearing: toggleArrayItem powers every filter chip + insurance
//    multi-select; buildStars drives the rating UI. Pure → trivially testable. ✨

import { test, expect } from "@playwright/test";
import { toggleArrayItem, buildStars } from "@/lib/utils/array-utils";

test.describe("toggleArrayItem", () => {
  test("adds an item when missing (returns a new array)", () => {
    const input = ["a", "b"];
    const out = toggleArrayItem(input, "c");
    expect(out).toEqual(["a", "b", "c"]);
    expect(input).toEqual(["a", "b"]); // 🔒 immutability — source untouched
  });

  test("removes an item when present", () => {
    expect(toggleArrayItem(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });

  test("toggling twice returns to the original set", () => {
    const once = toggleArrayItem(["x"], "y");
    const twice = toggleArrayItem(once, "y");
    expect(twice).toEqual(["x"]);
  });
});

test.describe("buildStars", () => {
  test("produces 5 booleans, filled up to rating", () => {
    expect(buildStars(3)).toEqual([true, true, true, false, false]);
  });
  test("handles min and max", () => {
    expect(buildStars(0)).toEqual([false, false, false, false, false]);
    expect(buildStars(5)).toEqual([true, true, true, true, true]);
  });
});
