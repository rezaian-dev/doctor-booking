import { z } from "zod";

// 📱 Iranian mobile: 09 + 9 digits
const IRANIAN_MOBILE_REGEX = /^09\d{9}$/;
// 🪪 National code: empty or exactly 10 digits
const NATIONAL_CODE_REGEX = /^$|^\d{10}$/;
// ✉️ Email: empty or valid format
const EMAIL_REGEX = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 🔑 Password: empty or min 8 chars with letter + digit
const PASSWORD_REGEX = /^$|^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
// 🇮🇷 Persian names: only valid Persian letters, spaces, and zero-width chars
const PERSIAN_NAME_REGEX = /^[\u0621-\u0628\u062A-\u063A\u0641-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\s\u200C\u200D]+$/;

// ✅ Validates Persian name: trimmed, ≥2 visible chars, valid script
const isValidPersianName = (value: string): boolean => {
  const trimmed = value.trim();
  if (trimmed.length < 2) return false;
  return PERSIAN_NAME_REGEX.test(trimmed) && trimmed.replace(/[\s\u200C\u200D]/g, '').length >= 2;
};

// 📝 User profile validation schema (for update/register)
export const profileSchema = z.object({
  firstName: z.string().refine(isValidPersianName, "نام باید فارسی و حداقل ۲ حرف باشد"),
  lastName: z.string().refine(isValidPersianName, "نام خانوادگی باید فارسی و حداقل ۲ حرف باشد"),
  phone: z.string().regex(IRANIAN_MOBILE_REGEX, "شماره موبایل نامعتبر است"),
  nationalCode: z.string().regex(NATIONAL_CODE_REGEX, "کد ملی باید ۱۰ رقم باشد").optional(),
  email: z.string().regex(EMAIL_REGEX, "فرمت ایمیل صحیح نیست").optional(),
  city: z.string().optional(),
  password: z.string().regex(PASSWORD_REGEX, "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف و اعداد باشد").optional(),
  birthDate: z.string().optional(), // 📅 Expected: Jalali date string (e.g., "1375-04-22")
  gender: z.enum(["male", "female", ""]).optional(), // ♿️ "" = not specified
});

// 💡 Type-safe form data inferred from schema
export type ProfileFormData = z.infer<typeof profileSchema>;
