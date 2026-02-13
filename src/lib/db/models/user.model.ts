// 📁 lib/db/models/user.model.ts

import { Schema, model, models, Model } from "mongoose";

// 👤 User interface defining the structure of user documents
export interface IUser {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password: string;
  role: "admin" | "user" | "doctor";
  nationalCode?: string;
  birthDate?: string;
  gender?: "male" | "female";
  city?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 🗃️ Mongoose schema with validation rules
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, // 📞 Unique identifier
    email: { type: String, unique: true, sparse: true }, // ✉️ Optional, allows null duplicates
    password: { type: String, required: true, select: false }, // 🔒 Hidden by default
    role: { type: String, required: true, default: "user" }, // 🎭 Access level
    nationalCode: { type: String },
    birthDate: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    city: { type: String },
    avatar: { type: String }, // 🖼️ Profile picture URL
  },
  {
    timestamps: true, // ⏰ Auto-managed createdAt/updatedAt
    versionKey: false, // 🚫 Disable __v field
  }
);

// 📦 Export model (reuse existing or create new)
export const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
