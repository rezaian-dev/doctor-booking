import { Schema, model, models, Model, InferSchemaType, HydratedDocument } from "mongoose";

// 🎫 Random 8-char uppercase tracking code e.g. "A3F9K2BX"
const generateTrackingCode = (): string =>
  Math.random().toString(36).slice(2, 10).toUpperCase();

const AppointmentSchema = new Schema(
  {
    userId:   { type: Schema.Types.ObjectId, ref: "User",   required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date:     { type: String, required: true },
    time:     { type: String, required: true },
    status:   { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
    trackingCode: { type: String, unique: true, default: generateTrackingCode },

    // 🧑‍⚕️ Who the visit is for. bookedForSelf is the source of truth for the "booked for someone
    //    else" badge (safer than name comparison); for self-booking these mirror the account holder.
    patientName:   { type: String, default: "" },
    patientPhone:  { type: String, default: "" },
    bookedForSelf: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type IAppointment        = InferSchemaType<typeof AppointmentSchema>;
export type AppointmentDocument = HydratedDocument<IAppointment>;

export const Appointment: Model<IAppointment> =
  (models["Appointment"] as Model<IAppointment>) ??
  model<IAppointment>("Appointment", AppointmentSchema);
