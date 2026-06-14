import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string({ error: () => "ایمیل الزامی است" })
    .email("ایمیل معتبر نیست"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
