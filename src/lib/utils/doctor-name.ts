// 🩺 Prefix a doctor's name with the honorific "دکتر" — single source of truth so
//    every patient-facing surface (cards, profile, bio) stays consistent. ✨

// 🔍 Already titled? Matches both Persian (ک U+06A9) & Arabic (ك U+0643) kaf → no double "دکتر دکتر".
const HAS_DR_PREFIX = /^د[کك]تر\s/;

/** 🏷️ Returns the name prefixed with "دکتر" — empty-safe, idempotent. */
export function formatDoctorName(name?: string | null): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "";                                   // 🛟 nothing to title
  return HAS_DR_PREFIX.test(trimmed) ? trimmed : `دکتر ${trimmed}`;
}
