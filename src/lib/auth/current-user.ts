// 🔑 Server-only auth helpers shared by Server Actions — single source of truth for "who is
//    calling?", replacing the duplicated getUserId/getAdminId pair in each action file.
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/db/models/user";

// 👤 Current user id from the access-token cookie (null when missing/invalid)
export async function getCurrentUserId(): Promise<string | null> {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;
  const payload = await verifyAccessToken(token).catch(() => null);
  return payload?.userId ? String(payload.userId) : null;
}

// 👮 Same id, but only if the live DB role is admin — otherwise null
export async function requireAdminId(): Promise<string | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  await connectDB();
  const user = await User.findById(userId).select("role").lean<{ role: string }>();
  return user?.role === "admin" ? userId : null;
}
