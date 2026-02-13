import { z } from "zod";
import { REGEX } from './regex';

/**
 * 📬 Contact form validation
 * Persian name + request type + phone + message + optional email
 */
export const contactSchema = z.object({
  fullName: z.string().min(3, "حداقل ۳ حرف").regex(REGEX.PERSIAN, "فقط فارسی"),
  requestType: z.preprocess((v) => v || "", z.string().min(1, "نوع درخواست الزامی")),
  email: z.string().regex(REGEX.EMAIL, "ایمیل نامعتبر").optional().or(z.literal("")),
  phone: z.string().regex(REGEX.PHONE, "شماره نامعتبر"),
  message: z.string().min(10, "حداقل ۱۰ حرف").max(500, "حداکثر ۵۰۰ حرف"),
});

// 📦 Type export
export type ContactFormInput = z.infer<typeof contactSchema>;
