import { z } from "zod";

/**
 * 📝 Doctor review validation
 * Rating (1-5), recommendation (recommend/not-recommend), optional comment (max 1000 chars)
 */
export const reviewSchema = z.object({
  rating: z.number().min(1, "لطفاً امتیاز خود را انتخاب کنید"),
  recommendation: z.enum(["recommend", "not-recommend"], {message: "لطفاً نظر خود را انتخاب کنید",}),
  comment: z.string().max(1000, "حداکثر ۱۰۰۰ کاراکتر").optional().or(z.literal("")),
});

// 💡 Type inference
export type ReviewInput = z.infer<typeof reviewSchema>;
