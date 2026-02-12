import { z } from "zod";

// 🔤 Regex patterns
const PERSIAN_NAME = /^[\u0600-\u06FF\s]+$/;
const PHONE = /^09\d{9}$/;
const OTP = /^\d{5}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 🔐 Login schema
export const loginPhoneSchema = z.object({
  phone: z.string().regex(PHONE, "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

// 📝 Signup schema (without OTP)
export const signupSchema = z.object({
  firstName: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد").regex(PERSIAN_NAME, "نام باید فقط شامل حروف فارسی باشد"),
  lastName: z.string().trim().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد").regex(PERSIAN_NAME, "نام خانوادگی باید فقط شامل حروف فارسی باشد"),
  phone: z.string().trim().regex(PHONE, "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود"),
  password: z.string().regex(PASSWORD_REGEX, "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف و اعداد باشد"),
  email: z.string().regex(EMAIL_REGEX, "فرمت ایمیل صحیح نیست").optional().or(z.literal('')),
});

// ✅ Verify OTP schema (signup + OTP)
export const verifySignupSchema = signupSchema.extend({
  otp: z.string().regex(OTP, "کد تأیید باید ۵ رقم باشد"),
});

// 🔑 Standalone OTP schema
export const otpSchema = z.object({
  otp: z.string().regex(OTP, "کد تأیید باید ۵ رقم باشد"),
});

// 🔷 Inferred types
export type LoginPhoneInput = z.infer<typeof loginPhoneSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type VerifySignupInput = z.infer<typeof verifySignupSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
