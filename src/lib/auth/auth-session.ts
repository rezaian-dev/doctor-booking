import { verifyAccessToken } from "@/lib/auth/auth-jwt";
import { connectDB } from "@/lib/db/db-connect";
import { User } from "@/lib/db/models/user.model";
import { NextRequest } from "next/server";

// 🔒 Get authenticated user from JWT
export default async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload?.userId) return null;

  await connectDB();
  return User.findById(payload.userId);
}
