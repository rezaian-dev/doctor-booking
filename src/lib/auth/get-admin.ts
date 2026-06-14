// 🔐 Centralized admin authentication — single source of truth for the admin module.
// Wrapped in React `cache()` so layout + page share ONE DB read per request (no duplication).
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/db/models/user";

// 👤 Public shape of the authenticated admin (plain, serializable)
export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: string;
}

// 🔍 Read the current admin from the access-token cookie. Returns null when absent/invalid.
// `cache()` dedupes this across the whole request tree (layout + nested pages).
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token).catch(() => null);
  if (!payload?.userId) return null;

  await connectDB();

  const user = await User.findById(payload.userId)
    .select("firstName lastName email avatar role isBanned")
    .lean<{
      _id: unknown;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
      role: string;
      isBanned?: boolean;
    }>();

  // 🚫 Block banned users & non-admins (ban enforcement moved here from the
  //    edge proxy, which can no longer touch the DB).
  if (!user || user.isBanned || user.role !== "admin") return null;

  return {
    _id: String(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar ?? "",
    role: user.role,
  };
});

// 🛡️ Guard helper — redirects to login when not an admin. Use at module boundaries.
// The expensive read stays cached; only the redirect side-effect lives here.
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/auth/login");
  return admin;
}
