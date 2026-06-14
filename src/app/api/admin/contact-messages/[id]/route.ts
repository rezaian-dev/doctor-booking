// ✉️ REST API — PATCH a contact message's status. ⚠️ /api/admin/* isn't covered by the page
//    middleware → self-guard via requireApiAdmin (same as the other admin routes).
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/db/models/contact-message";
import { requireApiAdmin } from "@/lib/auth/require-api-admin";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES = ["new", "seen", "replied"];

// 🏷️ PATCH — update message status
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const denied = await requireApiAdmin(); // 🛡️ admin only
  if (denied) return denied;

  const { id } = await ctx.params;
  const { status } = await req.json();
  if (!STATUSES.includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  await connectDB();
  await ContactMessage.findByIdAndUpdate(id, { status });
  return NextResponse.json({ success: true });
}
