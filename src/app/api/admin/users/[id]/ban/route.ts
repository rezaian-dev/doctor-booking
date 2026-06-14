// 🚫 REST API — toggle ban status for a user
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/db/models/user";
import { requireApiAdmin } from "@/lib/auth/require-api-admin";

type Ctx = { params: Promise<{ id: string }> };

/* 🔁 PATCH — toggle isBanned field */
export async function PATCH(_req: NextRequest, ctx: Ctx) {
  const denied = await requireApiAdmin(); // 🛡️ admin only
  if (denied) return denied;
  const { id } = await ctx.params;
  await connectDB();

  // 🔍 Read current ban status
  const user = await User.findById(id)
    .select("isBanned")
    .lean<{ isBanned: boolean }>();

  if (!user)
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });

  // 🔄 Flip the ban flag
  const updated = await User.findByIdAndUpdate(
    id,
    { $set: { isBanned: !user.isBanned } },
    { new: true, select: "_id isBanned" }
  ).lean();

  return NextResponse.json({ data: updated });
}
