"use server";

import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";
import { User } from "@/lib/db/models/user";
import { connectDB } from "@/lib/db/connection";

// 🔐 SSR: returns serializable user or null (banned → null)
export async function getAuthUser() {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.userId).select("-password").lean();
  if (!user || user.isBanned) return null;

  return {
    _id:       user._id.toString(),
    firstName: user.firstName,
    lastName:  user.lastName,
    phone:     user.phone,
    email:     user.email,
    role:      user.role,
    avatar:    user.avatar,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}

// 📄 API routes: returns full user document or null (banned → null)
export async function getAuthUserDoc(token: string) {
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.userId).select("-password");
  if (!user || user.isBanned) return null;

  return user;
}
