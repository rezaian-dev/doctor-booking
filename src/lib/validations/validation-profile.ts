import { z } from "zod";

const IRANIAN_MOBILE_REGEX = /^09\d{9}$/;
const NATIONAL_CODE_REGEX = /^$|^\d{10}$/;
const EMAIL_REGEX = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^$|^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
const PERSIAN_NAME_REGEX = /^[\u0621-\u0628\u062A-\u063A\u0641-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\s\u200C\u200D]+$/;

const isValidPersianName = (value: string): boolean => {
  const trimmed = value.trim();
  if (trimmed.length < 2) return false;
  return PERSIAN_NAME_REGEX.test(trimmed) && trimmed.replace(/[\s\u200C\u200D]/g, '').length >= 2;
};

export const profileSchema = z.object({
  firstName: z.string().refine(isValidPersianName, "نام باید فارسی و حداقل ۲ حرف باشد"),
  lastName: z.string().refine(isValidPersianName, "نام خانوادگی باید فارسی و حداقل ۲ حرف باشد"),
  phone: z.string().regex(IRANIAN_MOBILE_REGEX, "شماره موبایل نامعتبر است"),
  nationalCode: z.string().regex(NATIONAL_CODE_REGEX, "کد ملی باید ۱۰ رقم باشد").optional(),
  email: z.string().regex(EMAIL_REGEX, "فرمت ایمیل صحیح نیست").optional(),
  city: z.string().optional(),
  password: z.string().regex(PASSWORD_REGEX, "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف و اعداد باشد").optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["male", "female", ""]).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
