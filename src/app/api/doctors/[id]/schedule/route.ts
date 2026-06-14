import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";
import {validate, ScheduleAddSchema, ScheduleDeleteSchema } from "@/lib/validations/doctor";

type RouteContext = { params: Promise<{ id: string }> };

// 🔄 Schedule edits change availability → bust the cached homepage doctor cards
//    (tag "doctors") and refresh the home route, so changes show in realtime. 🏷️✨
function bustDoctorCache() {
  revalidateTag("doctors", { expire: 0 }); // ⏱️ immediate bust (Next 16 requires a profile)
  revalidatePath("/");
}

// GET /api/doctors/:id/schedule
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  await connectDB();

  const doctor = await Doctor.findById(id).select("schedule");
  if (!doctor)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: doctor.schedule });
}

// 📅 POST /api/doctors/:id/schedule — body { date: "1403-10-24", times: [...] }.
//    Creates a new date slot or replaces the times for an existing date.
export async function POST(req: NextRequest, ctx: RouteContext) {
  const parsed = validate(ScheduleAddSchema, await req.json());
  if (!parsed.success)
    return NextResponse.json({ errors: parsed.errors }, { status: 400 });

  const { id } = await ctx.params;
  await connectDB();

  const doctor = await Doctor.findById(id);
  if (!doctor)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { date, times } = parsed.data;
  const existing = doctor.schedule.find((s) => s.date === date);

  if (existing) {
    existing.times = times;
  } else {
    doctor.schedule.push({ date, times });
  }

  await doctor.save();
  bustDoctorCache();
  return NextResponse.json({ data: doctor.schedule });
}

// 🗑️ DELETE /api/doctors/:id/schedule — body { date } removes the whole date,
//    { date, time } removes a single time slot.
export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const parsed = validate(ScheduleDeleteSchema, await req.json());
  if (!parsed.success)
    return NextResponse.json({ errors: parsed.errors }, { status: 400 });

  const { id } = await ctx.params;
  await connectDB();

  const doctor = await Doctor.findById(id);
  if (!doctor)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { date, time } = parsed.data;

  if (time) {
    const slot = doctor.schedule.find((s) => s.date === date);
    if (slot) slot.times = slot.times.filter((t) => t !== time);
  } else {
    // Cast needed because Mongoose DocumentArray has a stricter type than plain filter result
    doctor.schedule = doctor.schedule.filter(
      (s) => s.date !== date
    ) as typeof doctor.schedule;
  }

  await doctor.save();
  bustDoctorCache();
  return NextResponse.json({ data: doctor.schedule });
}
