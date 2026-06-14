import { Schema, model, models, Model, InferSchemaType, HydratedDocument } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    phone:     { type: String, required: true, unique: true },
    // 📧 Optional — unique ONLY when present. `sparse` lets many users have no email
    //    without colliding on a null value (the signup form marks email optional).
    email:     { type: String, unique: true, sparse: true },
    // 🔒 select:false — hash is never returned unless a query opts in via .select("+password")
    password:  { type: String, required: true, select: false },
    role:      { type: String, enum: ["admin", "user"], default: "user" },
    city:      { type: String, default: "" },
    // 🧾 Profile fields edited from /profile — must exist here or Mongoose's strict
    //    mode silently drops them on save (the classic "updated successfully but not in DB"). 🧠
    nationalCode: { type: String, default: "" },                                // 🪪 10-digit code (optional)
    birthDate:    { type: String, default: "" },                                // 📅 Jalali date string (e.g. 1370-05-12)
    gender:       { type: String, enum: ["male", "female", ""], default: "" },  // ⚧️ "" = unspecified
    avatar:    { type: String, default: "" },
    // 🚫 Blocks login and re-registration when true
    isBanned:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type IUser        = InferSchemaType<typeof UserSchema>;
export type UserDocument = HydratedDocument<IUser>;

export const User: Model<IUser> =
  (models["User"] as Model<IUser>) ?? model<IUser>("User", UserSchema);
