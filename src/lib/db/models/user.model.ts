import { Schema, model, models, Model } from "mongoose";

interface IUser {
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

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, default: "user" },
    nationalCode: { type: String },
    birthDate: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    city: { type: String },
    avatar: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
