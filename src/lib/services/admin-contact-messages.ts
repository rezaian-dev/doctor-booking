// ✉️ Admin contact-messages query — extracted from admin/contact-messages/page.tsx
import { connectDB } from "@/lib/db/connection";
import { ContactMessage } from "@/lib/db/models/contact-message";

export type MsgStatus = "new" | "seen" | "replied";

export type ContactMessageItem = {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  requestType: string;
  message: string;
  status: MsgStatus;
  createdAt: string;
};

const PAGE_SIZE = 10;
const VALID: MsgStatus[] = ["new", "seen", "replied"];

// 🏷️ Request-type codes → Persian labels (data concern, lives in the service)
const REQUEST_TYPE_FA: Record<string, string> = {
  appointment:  "نوبت‌دهی",
  consultation: "مشاوره",
  support:      "پشتیبانی",
  complaint:    "شکایت",
  other:        "سایر موارد",
};

export async function getAdminContactMessages(page: number, status: string) {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (VALID.includes(status as MsgStatus)) query.status = status;

  const [raw, total, grouped] = await Promise.all([
    ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean<{ _id: unknown; fullName: string; phone: string; email?: string; requestType: string; message: string; status: string; createdAt?: Date }[]>(),
    ContactMessage.countDocuments(query),
    ContactMessage.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const counts = Object.fromEntries(grouped.map((g) => [g._id, g.count]));

  return {
    messages: raw.map((m) => ({
      _id:         String(m._id),
      fullName:    m.fullName,
      phone:       m.phone,
      email:       m.email ?? "",
      requestType: REQUEST_TYPE_FA[m.requestType] ?? m.requestType,
      message:     m.message,
      status:      (m.status as MsgStatus) ?? "new",
      // 📅 Pin Tehran TZ → date reflects local Iran time, not the server host TZ
      createdAt:   m.createdAt
        ? new Date(m.createdAt).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tehran" })
        : "",
    })) as ContactMessageItem[],
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    // 📊 Per-status counts for the dashboard stat cards
    stats: {
      new:     counts.new     ?? 0,
      seen:    counts.seen    ?? 0,
      replied: counts.replied ?? 0,
    },
  };
}
