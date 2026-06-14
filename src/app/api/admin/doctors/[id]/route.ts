// 🏥 REST API — GET, PUT, DELETE for a single doctor by ID
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";
import { requireApiAdmin } from "@/lib/auth/require-api-admin";

/* ⚡ Next.js 15 — params is a Promise in async route handlers */
type Ctx = { params: Promise<{ id: string }> };

// 🔄 Revalidate the ISR routes that show doctors so create/update/delete appear at once
function revalidateDoctors() {
  revalidateTag("doctors", { expire: 0 }); // 🏷️⏱️ immediately bust cached homepage doctor cards (Next 16 needs a profile)
  revalidatePath("/");
  revalidatePath("/doctors");
}

/* 🔍 GET — fetch doctor by ID */
export async function GET(_: NextRequest, ctx: Ctx) {
  const denied = await requireApiAdmin(); // 🛡️ admin only
  if (denied) return denied;
  const { id } = await ctx.params;
  await connectDB();
  const doctor = await Doctor.findById(id).lean();
  if (!doctor)
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  return NextResponse.json({
    data: { ...doctor, _id: String((doctor as { _id: unknown })._id) },
  });
}

/* ✏️ PUT — update doctor fields */
export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await requireApiAdmin(); // 🛡️ admin only
  if (denied) return denied;
  const { id } = await ctx.params;
  await connectDB();
  const body = (await req.json()) as Record<string, unknown>;
  const doctor = await Doctor.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );
  if (!doctor)
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  revalidateDoctors();
  return NextResponse.json({ data: doctor });
}

/* 🗑️ DELETE — remove doctor permanently */
export async function DELETE(_: NextRequest, ctx: Ctx) {
  const denied = await requireApiAdmin(); // 🛡️ admin only
  if (denied) return denied;
  const { id } = await ctx.params;
  await connectDB();
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor)
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  revalidateDoctors();
  return NextResponse.json({ message: "دکتر حذف شد" });
}
