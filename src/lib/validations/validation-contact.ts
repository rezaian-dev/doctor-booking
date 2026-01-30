import { z } from "zod";

// 🔤 Regex patterns
const REGEX = {
  PERSIAN: /^[\u0600-\u06FF\s]+$/,
  PHONE: /^09\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/**
 * 📬 Contact form validation
 * Persian name, email, Iranian mobile, request type, message (10-500 chars)
 */
export const contactSchema = z.object({
  fullName: z.string().min(3, "حداقل ۳ کاراکتر وارد کنید").regex(REGEX.PERSIAN, "فقط از حروف فارسی استفاده کنید"),
  requestType: z.preprocess((val) => val || "",z.string().min(1, "لطفاً نوع درخواست را انتخاب کنید")),
  email: z.string().regex(REGEX.EMAIL, "فرمت ایمیل نامعتبر است").optional().or(z.literal("")),
  phone: z.string().regex(REGEX.PHONE, "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد"),
  message: z.string().min(10, "متن پیام باید حداقل ۱۰ کاراکتر باشد").max(500, "متن پیام نباید بیشتر از ۵۰۰ کاراکتر باشد"),
});

// 💡 Type inference
export type ContactFormInput = z.infer<typeof contactSchema>;
