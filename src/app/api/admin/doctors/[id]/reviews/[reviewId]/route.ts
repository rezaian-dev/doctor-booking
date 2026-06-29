// ⭐ REST API — PATCH (approve/reject) and DELETE for a single review
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";
import { requireApiAdmin } from "@/lib/auth/require-api-admin";
import { reviewStatusSchema } from "@/lib/validations/admin";

type Ctx = { params: Promise<{ id: string; reviewId: string }> };

/* 🏷️ PATCH — approve or reject a review */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const denied = await requireApiAdmin(); // 🛡️ admin only
    if (denied) return denied;
    const { id, reviewId } = await ctx.params;
    await connectDB();

    const body = (await req.json()) as unknown;
    const parsed = reviewStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "داده نامعتبر است" },
        { status: 400 }
      );
    }

    // 🔄 Update the nested review status using positional $ operator
    const result = await Doctor.findOneAndUpdate(
      { _id: id, "reviews._id": reviewId },
      { $set: { "reviews.$.status": parsed.data.status } },
      { new: true }
    ).lean();

    if (!result) {
      return NextResponse.json(
        { error: "دکتر یا نظر مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    // ♻️ Approving/rejecting changes the doctor's approved-review average → bust the cached
    //    home lists (popular/newest) so the new rating shows up right away. 🧠
    revalidateTag("doctors", { expire: 0 }); // ⏱️ immediate bust (Next 16 needs a profile)
    revalidatePath("/");        // 🏠 home «محبوب‌ترین پزشکان»
    revalidatePath("/doctors"); // 🩺 doctors list

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

/* 🗑️ DELETE — remove a review permanently */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const denied = await requireApiAdmin(); // 🛡️ admin only
    if (denied) return denied;
    const { id, reviewId } = await ctx.params;
    await connectDB();

    // 🗑️ Pull the review out of the reviews array
    const result = await Doctor.findByIdAndUpdate(
      id,
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    ).lean();

    if (!result) {
      return NextResponse.json({ error: "دکتر یافت نشد" }, { status: 404 });
    }

    // ♻️ Deleting an (approved) review changes the average → refresh cached home lists. 🧠
    revalidateTag("doctors", { expire: 0 });
    revalidatePath("/");
    revalidatePath("/doctors");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
