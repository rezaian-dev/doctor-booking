import { Schema, model, models, Model, HydratedDocument, InferSchemaType } from "mongoose";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const ReviewSchema = new Schema(
  {
    userId:     { type: Schema.Types.ObjectId },
    userName:   { type: String, default: "کاربر ناشناس" },
    userAvatar: { type: String, default: "" },
    rating:     { type: Number, required: true, min: 1, max: 5 },
    comment:    { type: String, default: "" }, // 📝 optional in the UI → must not be required here
    status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const TimeSlotSchema = new Schema({
  date:  { type: String, required: true }, // 📅 "1403-10-15"
  times: [{ type: String }],               // 🕐 ["09:15", "09:30"]
});

const DoctorSchema = new Schema(
  {
    name:       { type: String, required: true },
    specialty:  { type: String, required: true },
    experience: { type: Number, required: true },
    about:      { type: String, default: "" },
    medicalCode: { type: String, required: true, unique: true },
    address:  { type: String, required: true },
    city:     { type: String, required: true },
    gender:   { type: String, enum: ["male", "female"], required: true },
    photo:    { type: String, default: "" },
    visitFee:         { type: Number,  required: true },
    hasOnlineVisit:   { type: Boolean, default: false },
    hasInPersonVisit: { type: Boolean, default: true },
    acceptedInsurances: [{ type: String }],
    contact: {
      phone:     { type: String, default: "" },
      website:   { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    schedule: [TimeSlotSchema],
    reviews:  [ReviewSchema],
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// 🚀 With thousands of doctors, the /doctors search filters and sorts must hit indexes instead
//    of scanning the whole collection. (medicalCode already has a unique index.) 🧠
DoctorSchema.index({ createdAt: -1 });            // 🆕 newest / default sort
DoctorSchema.index({ specialty: 1 });             // 🔬 specialty filter
DoctorSchema.index({ city: 1 });                  // 📍 city filter
DoctorSchema.index({ gender: 1, experience: 1 }); // 🧑‍⚕️ gender + experience filters
DoctorSchema.index({ "schedule.date": 1 });       // 🗓️ availability / weekend ($elemMatch on date)

// ─── Inferred types ───────────────────────────────────────────────────────────

export type ITimeSlot = InferSchemaType<typeof TimeSlotSchema>;
export type IReview   = InferSchemaType<typeof ReviewSchema>;
export type IDoctor   = InferSchemaType<typeof DoctorSchema>;

// ─── Virtual types ────────────────────────────────────────────────────────────

type DoctorVirtuals  = { firstAvailable: ITimeSlot | null; reviewStats: { count: number; avg: number } };
type DoctorDocument  = HydratedDocument<IDoctor, DoctorVirtuals>;
type DoctorModel     = Model<IDoctor, object, object, DoctorVirtuals, DoctorDocument>;

// ─── Virtuals ─────────────────────────────────────────────────────────────────

// 🗓️ First upcoming slot with available times
DoctorSchema.virtual("firstAvailable").get(function (this: DoctorDocument): ITimeSlot | null {
  const today = new Date();
  return (
    (this.schedule as ITimeSlot[])
      .filter((s) => s.times.length > 0 && new Date(s.date) >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
  );
});

// ⭐ Avg rating computed only from approved reviews
DoctorSchema.virtual("reviewStats").get(function (this: DoctorDocument): { count: number; avg: number } {
  const approved = (this.reviews as IReview[]).filter((r) => (r as IReview & { status: string }).status === "approved");
  const count    = approved.length;
  const avg      = count > 0 ? approved.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  return { count, avg: Math.round(avg * 10) / 10 };
});

DoctorSchema.set("toJSON",   { virtuals: true });
DoctorSchema.set("toObject", { virtuals: true });

// ─── Export ───────────────────────────────────────────────────────────────────

export const Doctor =
  (models["Doctor"] as DoctorModel | undefined) ??
  model<IDoctor, DoctorModel>("Doctor", DoctorSchema);
