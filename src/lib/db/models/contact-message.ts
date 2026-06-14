// 📬 Contact form submissions from website visitors
import { Schema, model, models, Model, InferSchemaType } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    fullName:    { type: String, required: true, trim: true },
    phone:       { type: String, required: true },
    email:       { type: String, default: "" },
    requestType: { type: String, required: true },
    message:     { type: String, required: true },
    // 📌 Status: new → replied (only after admin sends actual reply)
    status:      { type: String, enum: ["new", "seen", "replied"], default: "new" },
    // 📝 Admin reply text — stored for reference
    adminReply:  { type: String, default: "" },
    // 🕐 Timestamp when admin replied
    repliedAt:   { type: Date, default: null },
  },
  { timestamps: true }
);

export type IContactMessage = InferSchemaType<typeof ContactMessageSchema>;

export const ContactMessage: Model<IContactMessage> =
  (models["ContactMessage"] as Model<IContactMessage>) ??
  model<IContactMessage>("ContactMessage", ContactMessageSchema);
