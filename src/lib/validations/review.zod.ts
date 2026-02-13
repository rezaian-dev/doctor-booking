import { z } from "zod";

/**
 * ⭐ Doctor review validation
 * Rating (1-5) + recommendation + optional comment (max 1000 chars)
 */
export const reviewSchema = z.object({
  rating: z.number().min(1, "امتیاز الزامی"), // ⭐ 1-5 stars
  recommendation: z.enum(["recommend", "not-recommend"], { message: "نظر الزامی" }), // 👍👎
  comment: z.string().max(1000, "حداکثر ۱۰۰۰ حرف").optional().or(z.literal("")), // 💬 Optional feedback
});

// 📦 Type export
export type ReviewInput = z.infer<typeof reviewSchema>;
