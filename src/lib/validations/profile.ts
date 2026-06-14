import { isValidPersianName, REGEX } from "@/lib/validations/regex";
import { z } from "zod";

export const profileSchema = z.object({
  firstName:    z.string().refine(isValidPersianName, "نام باید فارسی و حداقل ۲ حرف باشد"),
  lastName:     z.string().refine(isValidPersianName, "نام خانوادگی باید فارسی و حداقل ۲ حرف باشد"),
  phone:        z.string().regex(REGEX.PHONE,             "شماره موبایل معتبر نیست"),
  nationalCode: z.string().regex(REGEX.NATIONAL_CODE_OPT, "کد ملی باید ۱۰ رقم باشد").optional(),
  email:        z.string().regex(REGEX.EMAIL_OPT,          "ایمیل معتبر نیست").optional(),
  city:         z.string().optional(),
  password:     z.string().regex(REGEX.PASSWORD_OPT,       "رمز عبور: حداقل ۸ کاراکتر، شامل حرف و عدد").optional(),
  birthDate:    z.string().optional(),
  gender:       z.enum(["male", "female", ""]).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
