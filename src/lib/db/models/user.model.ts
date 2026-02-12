import { Schema, model, models, Model } from "mongoose";

/**
 * 👤 User document interface (aligned with MongoDB schema)
 * - All fields match schema definition
 * - `createdAt`/`updatedAt` auto-managed by `timestamps: true`
 */
export interface IUser {
  firstName: string;
  lastName: string;
  phone: string;                    // 📱 Unique, required
  email?: string;                   // ✉️ Optional, unique if set
  password: string;                 // 🔑 Required, excluded by default (`select: false`)
  role: "admin" | "user" | "doctor"; // 👮‍♂️ Default: "user"
  nationalCode?: string;            // 🪪 Iranian national ID (optional)
  birthDate?: string;               // 📅 Jalali date string (e.g., "1370-05-15")
  gender?: "male" | "female";       // ♿️ Binary gender field
  city?: string;                    // 🏙️ Current city
  avatar?: string;                  // 🖼️ Profile image URL
  createdAt: Date;                  // 🕒 Auto-set on creation
  updatedAt: Date;                  // 🕒 Auto-updated on save
}

// 🗃️ Mongoose schema with validation & indexing
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },      // 📱 Indexed + unique
    email: { type: String, unique: true, sparse: true },        // ✉️ Unique only when present
    password: { type: String, required: true, select: false },  // 🔒 Never returned by default
    role: { type: String, required: true, default: "user" },
    nationalCode: { type: String },
    birthDate: { type: String },                                // 📅 Stored as Jalali string
    gender: { type: String, enum: ["male", "female"] },
    city: { type: String },
    avatar: { type: String },
  },
  {
    timestamps: true,   // ✅ Auto-manages `createdAt`/`updatedAt`
    versionKey: false   // 🚫 Removes `__v` field
  }
);

// 🔄 Safe model initialization (prevents duplicate compilation in dev)
export const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
