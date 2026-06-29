// ⭐ Submit review server action — extracted from (main)/doctors/[id]/comment/page.tsx
"use server";

import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";
import { User } from "@/lib/db/models/user";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { reviewSchema } from "@/lib/validations/review";
import type { QueryFilter } from "mongoose";
import type { IDoctor } from "@/lib/db/models/doctor";

export async function submitReview(doctorId: string, data: unknown): Promise<void> {
  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) throw new Error("اطلاعات نامعتبر است");

  const token = (await cookies()).get("accessToken")?.value;
  if (!token) throw new Error("برای ثبت نظر ابتدا وارد شوید");

  const payload = await verifyAccessToken(token);
  if (!payload?.userId) throw new Error("توکن نامعتبر است");

  await connectDB();

  const dbUser = (await User.findById(payload.userId)
    .select("firstName lastName avatar")
    .lean()) as { firstName: string; lastName: string; avatar?: string } | null;

  if (!dbUser) throw new Error("کاربر یافت نشد");

  // 🛡️ Race-safe insert: the filter rejects the push if this user already
  //    reviewed this doctor, so a double-submit can't create two reviews. 🧱
  const guardFilter: QueryFilter<IDoctor> = {
    _id: doctorId,
    "reviews.userId": { $ne: String(payload.userId) },
  };
  let found;
  try {
    found = await Doctor.findOneAndUpdate(
      guardFilter,
      {
        $push: {
          reviews: {
            ...parsed.data,
            userId:     payload.userId,
            userName:   `${dbUser.firstName} ${dbUser.lastName}`,
            userAvatar: dbUser.avatar ?? "",
            status:     "pending",
          },
        },
      },
      { new: true, runValidators: true },
    );
  } catch {
    // 🚫 Never surface raw Mongoose/validation messages to the user
    throw new Error("ثبت نظر با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
  }

  // 🩺 null → doctor missing OR user already left a review; disambiguate
  if (!found) {
    const doctorExists = await Doctor.exists({ _id: doctorId });
    throw new Error(doctorExists ? "شما قبلاً برای این پزشک نظر ثبت کرده‌اید" : "دکتر یافت نشد");
  }
}
