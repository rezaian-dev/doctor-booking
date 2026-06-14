import { REGEX } from "@/lib/validations/regex";
import { z } from "zod";

const fa = (msg: string) => () => msg;

export const contactSchema = z.object({

  fullName: z
    .string({ error: fa("نام و نام خانوادگی الزامی است") })
    .min(3, "نام باید حداقل ۳ حرف باشد")
    .regex(REGEX.PERSIAN, "نام باید فارسی باشد"),

  requestType: z.enum(
    ["appointment", "consultation", "support", "complaint", "other"],
    { error: fa("نوع درخواست را انتخاب کنید") }
  ),

  phone: z
    .string({ error: fa("شماره تماس الزامی است") })
    .regex(REGEX.PHONE, "شماره موبایل معتبر نیست"),

  email: z
    .string({ error: fa("ایمیل معتبر نیست") })
    .regex(REGEX.EMAIL, "ایمیل معتبر نیست")
    .or(z.literal(""))
    .optional(),

  message: z
    .string({ error: fa("متن پیام الزامی است") })
    .min(10, "پیام حداقل ۱۰ کاراکتر است")
    .max(500, "پیام حداکثر ۵۰۰ کاراکتر است"),
});

export type ContactFormInput = z.infer<typeof contactSchema>;
