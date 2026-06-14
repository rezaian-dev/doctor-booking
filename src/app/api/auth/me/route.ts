// 👤 Current user + unread count for client-side header personalization. Lets the homepage
//    stay fully static/ISR — the header auth widget fetches this per-visitor instead. 🧠
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/session";
import { getUnreadCount } from "@/lib/actions/message";

export const dynamic = "force-dynamic"; // 🔁 always per-request (reads auth cookie)

export async function GET() {
  const [user, unreadCount] = await Promise.all([getAuthUser(), getUnreadCount()]);

  return NextResponse.json(
    {
      // 📦 Only plain, non-sensitive fields the header needs
      user: user
        ? {
            firstName: user.firstName ?? "",
            lastName:  user.lastName ?? "",
            phone:     user.phone ?? null,
            avatar:    user.avatar || null,
          }
        : null,
      unreadCount,
    },
    // 🚫 Per-visitor auth payload → never cache. Stops a browser/CDN from replaying a
    //    stale `{ user: null }` (captured mid token-refresh) and hiding the avatar. 🩹
    { headers: { "Cache-Control": "no-store, must-revalidate" } },
  );
}
