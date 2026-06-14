// 🔤 Centralized regex patterns — ES2018+ Unicode property escapes

export const REGEX = {
  // 🇮🇷 Persian/Arabic script + ZWNJ + spaces
  PERSIAN:           /^[\p{Script=Arabic}\s\u200C\u200D]+$/u,

  // 📞 Mobile: 09xxxxxxxxx | Landline: 0xx(x)-xxxxxxx(x)
  PHONE:             /^09\d{9}$/,
  PHONE_CONTACT:     /^0\d{2,3}-?\d{7,8}$/,

  // 📧 Email — standard + optional variant (allows empty)
  EMAIL:             /^[\w.%+-]+@[\w.-]+\.\p{L}{2,}$/u,
  EMAIL_OPT:         /^(?:[\w.%+-]+@[\w.-]+\.\p{L}{2,})?$/u,

  // 🔑 Password — min 8 chars, ≥1 letter + ≥1 digit + special chars allowed
  PASSWORD:          /^(?=.*\p{L})(?=.*\d)[\p{L}\d@$!%*?&]{8,}$/u,
  PASSWORD_OPT:      /^(?:(?=.*\p{L})(?=.*\d)[\p{L}\d@$!%*?&]{8,})?$/u,

  // 🪪 National code — 10 digits (optional variant allows empty)
  NATIONAL_CODE:     /^\d{10}$/,
  NATIONAL_CODE_OPT: /^(?:\d{10})?$/,

  // 🔢 OTP — 5 digits
  OTP:               /^\d{5}$/,

  // 🆔 MongoDB ObjectId — 24 hex chars
  MONGO_ID:          /^[a-f\d]{24}$/i,

  // 📅 Jalali date — YYYY-MM-DD (zero-padded month/day)
  JALALI_DATE:       /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,

  // 📅 Jalali date (flexible) — YYYY-MM-DD or YYYY/MM/DD, single/double digit month+day
  //    Used by doctor schedule forms and Persian date pickers
  JALALI_DATE_FLEX:  /^\d{4}[-/]\d{2}[-/]\d{2}$/,

  // ⏰ Time slot — HH:MM (00:00–23:59)
  TIME_SLOT:         /^([01]\d|2[0-3]):[0-5]\d$/,

  // 🩺 Medical code & 📸 Instagram handle
  MEDICAL_CODE:      /^\d{5}$/,
  INSTAGRAM:         /^[\w.]{1,30}$/,
} as const;

export type RegexKey = keyof typeof REGEX;

// ✅ Persian name: min 2 real chars after stripping whitespace/ZWNJ
export const isValidPersianName = (val: string): boolean => {
  const clean = val.trim().replace(/[\s\u200C\u200D]/g, "");
  return clean.length >= 2 && REGEX.PERSIAN.test(val.trim());
};
