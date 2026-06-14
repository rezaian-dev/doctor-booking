"use server";

import { connectDB }      from "@/lib/db/connection";
import { Appointment }    from "@/lib/db/models/appointment";
import { Doctor }         from "@/lib/db/models/doctor";
import { getAuthUser }    from "@/lib/auth/session";
import { todayJalali }    from "@/hooks/use-jalaali";
import { revalidatePath, revalidateTag } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────
export type AppointmentItem = {
  _id:          string;
  date:         string;
  time:         string;
  status:       "active" | "expired" | "cancelled";
  trackingCode: string;
  // 🧑‍⚕️ Who the visit is for — `bookedForSelf` drives the "booked for someone else" badge
  patientName:   string;
  patientPhone:  string;
  bookedForSelf: boolean;
  doctor: { _id: string; name: string; specialty: string; photo: string; city: string };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ⏳ True if appointment date/time is already past
const isExpired = (apptDate: string, apptTime: string): boolean => {
  const { date: today, time: now } = todayJalali();
  return apptDate < today || (apptDate === today && apptTime <= now);
};

// 🔄 Bulk-expire past active appointments for a user
async function expireOldAppointments(userId: string): Promise<void> {
  const { date: today, time: now } = todayJalali();
  await Appointment.updateMany(
    { userId, status: "active", $or: [{ date: { $lt: today } }, { date: today, time: { $lte: now } }] },
    { $set: { status: "expired" } }
  );
}

// ─── getAppointments ──────────────────────────────────────────────────────────
export async function getAppointments(): Promise<{ data?: AppointmentItem[]; error?: string }> {
  const user = await getAuthUser();
  if (!user) return { error: "لطفاً وارد شوید" };

  await connectDB();
  await expireOldAppointments(user._id);

  // 🔗 doctorId is populated → typed lean shape (no `any`)
  type PopulatedAppt = {
    _id: unknown;
    date: string;
    time: string;
    status: AppointmentItem["status"];
    trackingCode?: string;
    patientName?: string;
    patientPhone?: string;
    bookedForSelf?: boolean;
    doctorId: { _id: unknown; name?: string; specialty?: string; photo?: string; city?: string };
  };

  // 🐛→✅ Was ["active","cancelled"], which surfaced cancelled rows and hid real history. Cancelled
  //    slots are freed & re-bookable, so show only what the user owns: active (upcoming) + expired (past). 🧹
  const raw = await Appointment.find({ userId: user._id, status: { $in: ["active", "expired"] } })
    .sort({ date: -1, time: -1 })
    .populate("doctorId", "name specialty photo city")
    .lean<PopulatedAppt[]>();

  const data: AppointmentItem[] = raw.map(a => ({
    _id:          String(a._id),
    date:         String(a.date),
    time:         String(a.time),
    status:       a.status as AppointmentItem["status"],
    trackingCode: String(a.trackingCode ?? "—"), // 🎫 Fallback for legacy records
    // 🧑‍⚕️ Legacy rows (pre-feature) lack these → treat as a self-booking with no extra label
    patientName:   String(a.patientName ?? ""),
    patientPhone:  String(a.patientPhone ?? ""),
    bookedForSelf: a.bookedForSelf !== false,
    doctor: {
      _id:       String(a.doctorId._id),
      name:      String(a.doctorId.name      ?? ""),
      specialty: String(a.doctorId.specialty ?? ""),
      photo:     String(a.doctorId.photo     ?? ""),
      city:      String(a.doctorId.city      ?? ""),
    },
  }));

  return { data };
}

// ─── cancelAppointment ────────────────────────────────────────────────────────
export async function cancelAppointment(appointmentId: string): Promise<{ success?: boolean; error?: string }> {
  const user = await getAuthUser();
  if (!user) return { error: "لطفاً وارد شوید" };

  await connectDB();

  const appt = await Appointment.findOne({ _id: appointmentId, userId: user._id, status: "active" });
  if (!appt) return { error: "نوبت یافت نشد یا قابل لغو نیست" };

  await Appointment.findByIdAndUpdate(appt._id, { $set: { status: "cancelled" } });

  // 🏥 Restore time slot only if appointment hasn't passed yet
  if (!isExpired(String(appt.date), String(appt.time))) {
    const doctor = await Doctor.findById(appt.doctorId);
    if (doctor) {
      const slot = doctor.schedule.find((s: { date: string; times: string[] }) => s.date === appt.date);
      if (slot) {
        if (!slot.times.includes(appt.time)) {
          slot.times.push(appt.time);
          slot.times.sort();
        }
      } else {
        doctor.schedule.push({ date: appt.date, times: [appt.time] });
        doctor.schedule.sort((a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date));
      }
      await doctor.save();
    }
  }

  revalidatePath("/appointments");
  // 🔄 A cancel restores the freed slot to the doctor's schedule, so the homepage
  //    cards (cached under tag "doctors") must reflect renewed availability too. ✨
  revalidateTag("doctors", { expire: 0 }); // ⏱️ immediate bust (Next 16 requires a profile)
  revalidatePath("/");
  revalidatePath("/doctors"); // 🩺 the listing surface must show the restored slot too
  return { success: true };
}
