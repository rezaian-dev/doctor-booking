import { z } from "zod";
import { REGEX } from "@/lib/validations/regex";

const JALALI_DATE = REGEX.JALALI_DATE_FLEX;
const TIME_SLOT   = REGEX.TIME_SLOT;

// 🚫 Reject duplicate schedule dates — one calendar day may appear only once. The error is
//    attached to the *later* duplicate row's date so the UI can highlight exactly that field. 🧠
//    Shared by the client form schema and the server schema → one rule, two layers (no drift). ✨
function refineUniqueDates(
  schedule: { date: string; times: string[] }[],
  ctx: z.RefinementCtx,
): void {
  const seen = new Set<string>();
  schedule.forEach((s, i) => {
    if (!s.date) return; // ⏭️ empty rows aren't duplicates yet
    if (seen.has(s.date)) {
      ctx.addIssue({ code: "custom", path: ["schedule", i, "date"], message: "این تاریخ تکراری است" });
    } else {
      seen.add(s.date);
    }
  });
}

// ─── Reusable schemas ─────────────────────────────────────────────────────────

export const ScheduleAddSchema = z.object({
  date:  z.string().regex(JALALI_DATE, "فرمت تاریخ معتبر نیست"),
  times: z.array(z.string().regex(TIME_SLOT, "فرمت ساعت معتبر نیست")).min(1, "حداقل یک ساعت انتخاب کنید"),
});

export const ScheduleDeleteSchema = z.object({
  date: z.string().regex(JALALI_DATE, "تاریخ معتبر نیست"),
  time: z.string().regex(TIME_SLOT).optional(),
});

export const BookingSchema = z.object({
  date: z.string().regex(JALALI_DATE, "تاریخ معتبر نیست"),
  time: z.string().regex(TIME_SLOT,   "ساعت معتبر نیست"),

  forSelf:      z.boolean().optional().default(true),
  patientName:  z.string().trim().min(1, "نام بیمار الزامی است").max(100).optional(),
  patientPhone: z.string().regex(REGEX.PHONE, "شماره موبایل بیمار معتبر نیست").optional(),
});

// ─── Client-side form validation ──────────────────────────────────────────────

export const ScheduleItemSchema = z.object({
  date:  z.string(),
  times: z.array(z.string()),
});
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;

export const DoctorFormSchema = z.object({
  name:        z.string().min(3, "نام حداقل ۳ کاراکتر است").max(100),
  specialty:   z.string().min(2, "تخصص الزامی است").max(100),
  experience:  z.coerce.number({ error: () => "سابقه باید عدد باشد" }).int().min(0).max(70, "سابقه حداکثر ۷۰ سال است"),
  medicalCode: z.string().min(4, "کد نظام پزشکی حداقل ۴ رقم است").regex(/^\d+$/, "کد نظام پزشکی فقط عدد است"),
  city:        z.string().min(2, "شهر الزامی است"),
  address:     z.string().min(10, "آدرس حداقل ۱۰ کاراکتر است"),
  about:       z.string().max(1000).optional(),
  visitFee:    z.coerce.number({ error: () => "هزینه ویزیت باید عدد باشد" }).min(0).max(100_000_000),
  phone:       z.string().regex(/^(0[0-9]{10}|)$/, "شماره تلفن معتبر نیست").optional(),
  website:     z.string().refine(v => !v || v.startsWith("http"), "آدرس سایت باید با http شروع شود").optional(),
  instagram:   z.string().max(50).optional(),

  gender:             z.enum(["male", "female"]),
  photo:              z.string(),
  hasInPersonVisit:   z.boolean(),
  hasOnlineVisit:     z.boolean(),
  acceptedInsurances: z.array(z.string()),
  schedule:           z.array(ScheduleItemSchema),
}).superRefine((data, ctx) => refineUniqueDates(data.schedule, ctx)); // 🚫 no two rows share a date

export type DoctorFormFields = z.infer<typeof DoctorFormSchema>;
export type DoctorFormErrors = Partial<Record<keyof DoctorFormFields, string>>;

// ─── Server-side validation ───────────────────────────────────────────────────

export const DoctorServerSchema = z.object({
  name: z.string()
    .min(3,   { error: "نام حداقل ۳ کاراکتر است" })
    .max(100, { error: "نام حداکثر ۱۰۰ کاراکتر است" }),
  specialty: z.string()
    .min(3,   { error: "تخصص حداقل ۳ کاراکتر است" })
    .max(100, { error: "تخصص حداکثر ۱۰۰ کاراکتر است" }),
  experience: z.number({
    error: (iss) => iss.input === undefined ? "سابقه الزامی است" : "سابقه باید عدد باشد",
  })
    .int(  { error: "سابقه باید عدد صحیح باشد" })
    .min(0, { error: "سابقه نمی‌تواند منفی باشد" })
    .max(70,{ error: "سابقه حداکثر ۷۰ سال است" }),
  medicalCode: z.string()
    .min(4,  { error: "کد نظام پزشکی حداقل ۴ رقم است" })
    .max(20, { error: "کد نظام پزشکی حداکثر ۲۰ کاراکتر است" })
    .regex(/^\d+$/, { error: "کد نظام پزشکی فقط عدد است" }),
  city:    z.string().min(2, { error: "شهر الزامی است" }).max(50),
  address: z.string().min(10, { error: "آدرس حداقل ۱۰ کاراکتر است" }).max(300),
  about:   z.string().max(1000).default(""),
  gender:  z.enum(["male", "female"], {
    error: (iss) => iss.input === undefined ? "جنسیت الزامی است" : "جنسیت معتبر نیست",
  }),
  photo:    z.string().default(""),
  visitFee: z.number({
    error: (iss) => iss.input === undefined ? "هزینه ویزیت الزامی است" : "هزینه ویزیت باید عدد باشد",
  }).min(0).max(100_000_000),
  hasInPersonVisit:   z.boolean().default(true),
  hasOnlineVisit:     z.boolean().default(false),
  acceptedInsurances: z.array(z.string()).default([]),
  contact: z.object({
    phone:     z.string().regex(/^(0[0-9]{10}|)$/, { error: "شماره تلفن معتبر نیست" }).default(""),
    website:   z.string().refine((v) => !v || v.startsWith("http"), { error: "آدرس سایت باید با http شروع شود" }).default(""),
    instagram: z.string().max(50).default(""),
  }),
  schedule: z.array(z.object({
    date:  z.string().min(1, { error: "تاریخ الزامی است" }),
    times: z.array(z.string()),
  })).default([]),
}).superRefine((data, ctx) => refineUniqueDates(data.schedule, ctx)); // 🚫 server-side guard: dates must be unique

export type DoctorServerInput = z.infer<typeof DoctorServerSchema>;

export function validate<T>(schema: z.ZodSchema<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, errors: mapZodIssues(result.error.issues) };
}

export function mapZodIssues(issues: z.ZodIssue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const iss of issues) {
    const key = iss.path.join(".");
    if (!out[key]) out[key] = iss.message;
  }
  return out;
}
