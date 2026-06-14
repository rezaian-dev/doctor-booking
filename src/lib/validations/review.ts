import { z } from "zod";

export const reviewSchema = z.object({
  rating:         z.number().min(1, "امتیاز الزامی است").max(5),
  recommendation: z.enum(["recommend", "not-recommend"], { error: "نظر خود را انتخاب کنید" }),
  comment:        z.string().max(1000, "نظر حداکثر ۱۰۰۰ کاراکتر است").or(z.literal("")).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
