import { z } from 'zod';
import { REGEX } from './regex';

// 🔐 Login schema
export const loginPhoneSchema = z.object({
  phone: z.string().regex(REGEX.PHONE, 'شماره نامعتبر'),
  password: z.string().min(8, 'رمز ۸+ کاراکتر').regex(REGEX.PASSWORD, 'رمز: حروف و اعداد'),
});

// 📝 Registration schema
export const registerSchema = z.object({
  firstName: z.string().trim().min(2, 'نام ۲+ حرف').regex(REGEX.PERSIAN, 'فقط فارسی'),
  lastName: z.string().trim().min(2, 'نام خانوادگی ۲+ حرف').regex(REGEX.PERSIAN, 'فقط فارسی'),
  phone: z.string().trim().regex(REGEX.PHONE, 'شماره نامعتبر'),
  password: z.string().regex(REGEX.PASSWORD, 'رمز: ۸+ کاراکتر، حروف و اعداد'),
  email: z.string().trim().regex(REGEX.EMAIL, 'ایمیل نامعتبر').optional().or(z.literal('')),
});

// ✅ Signup verification schema
export const verifySignupSchema = registerSchema.extend({
  otp: z.string().trim().regex(REGEX.OTP, 'کد ۵ رقمی'),
});

// 🔢 OTP-only schema
export const otpSchema = z.object({
  otp: z.string().trim().regex(REGEX.OTP, 'کد ۵ رقمی'),
});

// 📦 Type exports
export type LoginPhoneInput = z.infer<typeof loginPhoneSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifySignupInput = z.infer<typeof verifySignupSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
