// 👥 REST API — PATCH (role change) and DELETE for a single user
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/db/models/user";
import { requireApiAdmin } from "@/lib/auth/require-api-admin";
import { userRoleSchema } from "@/lib/validations/admin";

type Ctx = { params: Promise<{ id: string }> };

/* 🏷️ PATCH — change user role */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const denied = await requireApiAdmin(); // 🛡️ admin only
    if (denied) return denied;
    const { id } = await ctx.params;
    await connectDB();

    const body = (await req.json()) as unknown;
    const parsed = userRoleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { role: parsed.data.role } },
      { new: true, select: "_id role" }
    ).lean();

    if (!user)
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });

    return NextResponse.json({ data: user });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

/* 🗑️ DELETE — remove user permanently */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const denied = await requireApiAdmin(); // 🛡️ admin only
    if (denied) return denied;
    const { id } = await ctx.params;
    await connectDB();

    const deleted = await User.findByIdAndDelete(id).lean();
    if (!deleted)
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
