// 🎬 Principled AOS stagger — a single capped cascade for every animated grid/list. The cap
//    (AOS_MAX) stops late items (6th–10th) from waiting 500ms+ and reading as laggy, while the
//    first items still cascade nicely. 🧠

export const AOS_STEP = 80;  // ⏱️ gap between consecutive items (ms)
export const AOS_MAX = 240;  // 🚧 hard ceiling — items #4+ share this, never lag

/**
 * 🎯 Capped stagger delay for the Nth animated item.
 * @param index 0-based position in the list/grid
 * @param step  per-item gap (defaults to AOS_STEP)
 * @param max   ceiling for the delay (defaults to AOS_MAX)
 */
export function aosStagger(index: number, step: number = AOS_STEP, max: number = AOS_MAX): number {
  return Math.min(Math.max(index, 0) * step, max);
}
