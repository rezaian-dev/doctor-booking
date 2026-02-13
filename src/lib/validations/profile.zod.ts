import { z } from "zod";
import { REGEX, isValidPersianName } from './regex';

/**
 * 👤 User profile validation
 * Persian names + phone + optional fields (email, password, national code, etc.)
 */
export const profileSchema = z.object({
  firstName: z.string().refine(isValidPersianName, "نام فارسی، ۲+ حرف"),
  lastName: z.string().refine(isValidPersianName, "نام خانوادگی فارسی، ۲+ حرف"),
  phone: z.string().regex(REGEX.PHONE, "شماره نامعتبر"),
  nationalCode: z.string().regex(REGEX.NATIONAL_CODE_OPT, "کد ملی ۱۰ رقم").optional(),
  email: z.string().regex(REGEX.EMAIL_OPT, "ایمیل نامعتبر").optional(),
  city: z.string().optional(),
  password: z.string().regex(REGEX.PASSWORD_OPT, "رمز: ۸+ کاراکتر، حروف و اعداد").optional(),
  birthDate: z.string().optional(), // 📅 Jalali date expected
  gender: z.enum(["male", "female", ""]).optional(), // ⚧️ Empty = not specified
});

// 📦 Type export
export type ProfileFormData = z.infer<typeof profileSchema>;
