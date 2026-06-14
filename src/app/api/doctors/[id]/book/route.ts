import { NextRequest, NextResponse } from "next/server";
import { cookies }        from "next/headers";
import { revalidateTag, revalidatePath } from "next/cache";
import { connectDB }      from "@/lib/db/connection";
import { Doctor }         from "@/lib/db/models/doctor";
import { Appointment }    from "@/lib/db/models/appointment";
import { validate, BookingSchema } from "@/lib/validations/doctor";
import { getAuthUserDoc } from "@/lib/auth/session";
import type { ITimeSlot } from "@/lib/db/models/doctor";

type RouteCtx = { params: Promise<{ id: string }> };

// 🚀 POST /api/doctors/:id/book  —  body: { date: "1404-12-13", time: "11:00" }
export async function POST(req: NextRequest, { params }: RouteCtx): Promise<NextResponse> {

  // 🔐 Auth via httpOnly cookie
  const token = (await cookies()).get("accessToken")?.value;

  const user = await getAuthUserDoc(token ?? "");

  if (!user)
    return NextResponse.json({ error: "لطفاً ابتدا وارد شوید" }, { status: 401 });

  // 🛡️ Safe JSON parse
  let body: unknown;
  try   { body = await req.json(); }
  catch { return NextResponse.json({ error: "بدنه درخواست نامعتبر است" }, { status: 400 }); }


  // ✅ Zod validation
  const parsed = validate(BookingSchema, body);
  if (!parsed.success) {
    console.error("[book] validation failed:", JSON.stringify(parsed.errors, null, 2));
    return NextResponse.json({ errors: parsed.errors }, { status: 400 });
  }

  const { date, time, forSelf, patientName, patientPhone } = parsed.data;
  const { id: doctorId } = await params;

  // 🧑‍⚕️ Resolve who the visit is for. Self → trust the account, never the client payload.
  //    Other → require the entered name + phone (already format-checked by the schema). 🔒
  let visitorName: string;
  let visitorPhone: string;
  if (forSelf) {
    visitorName  = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    visitorPhone = String(user.phone ?? "");
  } else {
    if (!patientName?.trim() || !patientPhone?.trim())
      return NextResponse.json({ error: "نام و شماره موبایل بیمار الزامی است" }, { status: 400 });
    visitorName  = patientName.trim();
    visitorPhone = patientPhone.trim();
  }

  await connectDB();

  // 🚫 One appointment per day per user: a second slot on a day the user already holds an active
  //    appointment (any doctor) is rejected. A cancelled/expired record never blocks, so re-booking works.
  const sameDay = await Appointment.findOne({
    userId: user._id, date, status: "active",
  });
  if (sameDay)
    return NextResponse.json(
      { error: "شما برای این روز یک نوبت فعال دارید؛ امکان رزرو نوبت دوم در همان روز نیست" },
      { status: 409 },
    );

  // 🔒 Atomically claim the slot in one round-trip. The time is in the query filter, so MongoDB
  //    matches it for exactly one racing request (the loser gets null) → closes the TOCTOU window. ⚡
  const claimed = await Doctor.findOneAndUpdate(
    { _id: doctorId, schedule: { $elemMatch: { date, times: time } } },
    { $pull: { "schedule.$.times": time } },
    { new: true },
  );

  // 🩺 Distinguish "no such doctor" from "slot already gone"
  if (!claimed) {
    const doctorExists = await Doctor.exists({ _id: doctorId });
    return doctorExists
      ? NextResponse.json({ error: "این نوبت یافت نشد یا قبلاً رزرو شده است" }, { status: 409 })
      : NextResponse.json({ error: "دکتر یافت نشد" }, { status: 404 });
  }

  // 💾 Persist the appointment. If this fails, we must NOT leave the slot
  //    silently consumed — compensate by returning the time to the schedule. ♻️
  let trackingCode: string;
  try {
    const appt = await Appointment.create({
      userId: user._id, doctorId, date, time,
      // 🧑‍⚕️ Persist who the visit is for → surfaced on /appointments
      patientName: visitorName, patientPhone: visitorPhone, bookedForSelf: forSelf,
    });
    trackingCode = String(appt.trackingCode); // 🎫 real code → shown on success & in "My appointments"
  } catch (err) {
    console.error("[book] appointment create failed, rolling back slot:", err);
    await releaseSlot(doctorId, date, time);
    return NextResponse.json({ error: "خطا در ثبت نوبت، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }

  // 🧹 Best-effort cleanup: drop the date entry if it has no times left (cosmetic)
  const emptied = (claimed.schedule as unknown as ITimeSlot[]).find(s => s.date === date);
  if (emptied && emptied.times.length === 0)
    await Doctor.updateOne({ _id: doctorId }, { $pull: { schedule: { date, times: { $size: 0 } } } });

  // 🔄 Realtime: the claimed slot is gone from the DB, but home cards are served from the daily
  //    unstable_cache (tag "doctors") + ISR home route. revalidateTag clears the card data and
  //    revalidatePath("/") refreshes the home route so the change shows on return. 🧠✨
  revalidateTag("doctors", { expire: 0 }); // ⏱️ immediate bust (Next 16 requires a profile)
  revalidatePath("/");
  revalidatePath("/doctors"); // 🩺 the dedicated listing surface must drop the taken slot too

  return NextResponse.json(
    {
      message: "رزرو با موفقیت انجام شد",
      booking: { doctorId, date, time, trackingCode, patientName: visitorName, bookedForSelf: forSelf },
    },
    { status: 201 },
  );
}

// ♻️ Returns a claimed time to the doctor's schedule. Reuses the existing date bucket or
//    recreates it, so a rollback never loses the slot even if it was the day's last time.
async function releaseSlot(doctorId: string, date: string, time: string): Promise<void> {
  const restored = await Doctor.updateOne(
    { _id: doctorId, "schedule.date": date },
    { $addToSet: { "schedule.$.times": time } },
  );
  if (restored.matchedCount === 0)
    await Doctor.updateOne({ _id: doctorId }, { $push: { schedule: { date, times: [time] } } });
}
