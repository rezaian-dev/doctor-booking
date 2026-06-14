import { z } from "zod";

export const reviewStatusSchema = z.object({
  status: z.enum(["approved", "rejected"], {
    error: "وضعیت انتخاب‌شده معتبر نیست",
  }),
});

export type ReviewStatusInput = z.infer<typeof reviewStatusSchema>;

export const userRoleSchema = z.object({
  role: z.enum(["user", "admin"], {
    error: "نقش انتخاب‌شده معتبر نیست",
  }),
});

export type UserRoleInput = z.infer<typeof userRoleSchema>;
