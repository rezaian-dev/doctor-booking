import { REGEX } from "@/lib/validations/regex";
import { toEnDigits } from "@/lib/utils/persian-format";
import { z } from "zod";

const phoneField = z
  .string()
  .trim()
  .transform(toEnDigits)
  .refine((v) => REGEX.PHONE.test(v), "شماره موبایل معتبر نیست");

const otpField = z
  .string()
  .trim()
  .transform(toEnDigits)
  .refine((v) => REGEX.OTP.test(v), "کد تأیید باید ۵ رقم باشد");

export const loginPhoneSchema = z.object({
  phone:    phoneField,
  password: z.string().min(8, "رمز عبور حداقل ۸ کاراکتر است").regex(REGEX.PASSWORD, "رمز عبور باید شامل حرف و عدد باشد"),
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "نام حداقل ۲ حرف است").regex(REGEX.PERSIAN, "نام باید فارسی باشد"),
  lastName:  z.string().trim().min(2, "نام خانوادگی حداقل ۲ حرف است").regex(REGEX.PERSIAN, "نام خانوادگی باید فارسی باشد"),
  phone:     phoneField,
  password:  z.string().regex(REGEX.PASSWORD, "رمز عبور: حداقل ۸ کاراکتر، شامل حرف و عدد"),
  email:     z.string().trim().regex(REGEX.EMAIL, "ایمیل معتبر نیست").or(z.literal("")).optional(),
});

export const verifySignupSchema = registerSchema.extend({
  otp: otpField,
});

export const otpSchema = z.object({
  otp: otpField,
});

export type LoginPhoneInput   = z.infer<typeof loginPhoneSchema>;
export type RegisterInput     = z.infer<typeof registerSchema>;
export type VerifySignupInput = z.infer<typeof verifySignupSchema>;
export type OtpInput          = z.infer<typeof otpSchema>;
