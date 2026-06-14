// 🛡️ Admin guard for /api/admin/* handlers. proxy.ts only protects /admin pages, so every
//    admin API mutation must self-verify by calling this first.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/db/models/user";

// ✅ null → caller is an admin; otherwise a ready-to-return 401/403 response.
export async function requireApiAdmin(): Promise<NextResponse | null> {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 🔑 Verify JWT — invalid/expired token → reject
  const payload = await verifyAccessToken(token).catch(() => null);
  if (!payload?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 👮 Confirm the live role from the DB (token role alone is not trusted for writes)
  await connectDB();
  const user = await User.findById(payload.userId).select("role").lean<{ role: string }>();
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return null; // 🟢 authorized
}
