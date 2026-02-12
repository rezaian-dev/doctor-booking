import { z } from "zod";

// 🔤 Reusable regex patterns (immutable)
const REGEX = {
  PERSIAN: /^[\u0600-\u06FF\s]+$/, // 🇮🇷 Persian letters + spaces only
  PHONE: /^09\d{9}$/,              // 📱 Iranian mobile: 09 + 9 digits
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // ✉️ Standard email format
} as const;

/**
 * 📬 Contact form validation schema
 * - Full name: Persian, min 3 chars
 * - Request type: required (non-empty string)
 * - Email: optional but valid if provided
 * - Phone: mandatory Iranian mobile
 * - Message: 10–500 characters
 */
export const contactSchema = z.object({
  fullName: z
    .string()
    .min(3, "حداقل ۳ کاراکتر وارد کنید")
    .regex(REGEX.PERSIAN, "فقط از حروف فارسی استفاده کنید"),
  requestType: z
    .preprocess((val) => val || "", z.string().min(1, "لطفاً نوع درخواست را انتخاب کنید")),
  email: z
    .string()
    .regex(REGEX.EMAIL, "فرمت ایمیل نامعتبر است")
    .optional()
    .or(z.literal("")), // ✅ Accept empty string as "not provided"
  phone: z
    .string()
    .regex(REGEX.PHONE, "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد"),
  message: z
    .string()
    .min(10, "متن پیام باید حداقل ۱۰ کاراکتر باشد")
    .max(500, "متن پیام نباید بیشتر از ۵۰۰ کاراکتر باشد"),
});

// 💡 Type-safe inferred form data
export type ContactFormInput = z.infer<typeof contactSchema>;
