// 🛡️ Booking flow URL param schemas — shared by confirm and payment pages
import { z } from "zod";
import { REGEX } from "@/lib/validations/regex";

// ─── Confirm page params ──────────────────────────────────────────────────────

export const confirmParamsSchema = z.object({
  doctorId:    z.string().regex(REGEX.MONGO_ID),
  date:        z.string().regex(REGEX.JALALI_DATE),
  time:        z.string().regex(REGEX.TIME_SLOT),
  displayDate: z.string().min(1),
  displayTime: z.string().min(1),
});

export type ConfirmParams = z.infer<typeof confirmParamsSchema>;

// ─── Payment page params ──────────────────────────────────────────────────────

export const paymentParamsSchema = z.object({
  doctorId:    z.string().regex(REGEX.MONGO_ID,    "Invalid doctor ID"),
  date:        z.string().regex(REGEX.JALALI_DATE, "Invalid date format"),
  time:        z.string().regex(REGEX.TIME_SLOT,   "Invalid time format"),
  displayDate: z.string().min(1),
  displayTime: z.string().min(1),
  patientName: z.string().min(1),
  // 🧑‍⚕️ Optional with safe defaults so direct/legacy links never 404
  patientPhone: z.string().optional().default(""),
  forSelf:      z.enum(["0", "1"]).optional().default("1"),
});

export type PaymentParams = z.infer<typeof paymentParamsSchema>;
