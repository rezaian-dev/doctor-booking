// 🩺 Public read of a single doctor by id. ⚠️ Mutations removed (the unauthenticated PUT/DELETE
//    had no callers) — doctor writes go through admin actions + /api/admin/doctors/[id]. 🔒
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";

type RouteContext = { params: Promise<{ id: string }> };

// 🔍 GET /api/doctors/:id — read-only
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  await connectDB();

  const doctor = await Doctor.findById(id);
  if (!doctor)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: doctor });
}
