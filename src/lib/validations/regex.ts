/**
 * 🔤 Centralized regex patterns
 * Modern ES2018+ Unicode property escapes
 */
export const REGEX = {
  PERSIAN: /^[\p{Script=Arabic}\s\u200C\u200D]+$/u,
  PHONE: /^09\d{9}$/,
  EMAIL: /^[\w.%+-]+@[\w.-]+\.\p{L}{2,}$/u,
  EMAIL_OPT: /^(?:[\w.%+-]+@[\w.-]+\.\p{L}{2,})?$/u,
  PASSWORD: /^(?=.*\p{L})(?=.*\d)[\p{L}\d]{8,}$/u,
  PASSWORD_OPT: /^(?:(?=.*\p{L})(?=.*\d)[\p{L}\d]{8,})?$/u,
  NATIONAL_CODE: /^\d{10}$/,
  NATIONAL_CODE_OPT: /^(?:\d{10})?$/,
  OTP: /^\d{5}$/,
} as const;

/**
 * ✅ Validates Persian name: min 2 chars after trim
 */
export const isValidPersianName = (val: string): boolean => {
  const clean = val.trim().replace(/[\s\u200C\u200D]/g, '');
  return clean.length >= 2 && REGEX.PERSIAN.test(val.trim());
};
