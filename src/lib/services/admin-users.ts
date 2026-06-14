// 👥 Admin user list query — extracted from (dashboard)/admin/users/page.tsx
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/db/models/user";

export type UserItem = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  isBanned: boolean;
  avatar: string;
  createdAt: string;
};

const PAGE_SIZE = 10;

export async function getAdminUsers(page: number, search: string, role: string) {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (role)   query.role = role;
  if (search) query.$or  = [
    { firstName: { $regex: search, $options: "i" } },
    { lastName:  { $regex: search, $options: "i" } },
    { phone:     { $regex: search, $options: "i" } },
    { email:     { $regex: search, $options: "i" } },
  ];

  const [raw, total] = await Promise.all([
    User.find(query)
      .select("firstName lastName phone email role isBanned avatar createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean<{
        _id: unknown;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        role: string;
        isBanned?: boolean;
        avatar?: string;
        createdAt?: Date;
      }[]>(),
    User.countDocuments(query),
  ]);

  return {
    users: raw.map((u) => ({
      _id:       String(u._id),
      firstName: u.firstName ?? "",
      lastName:  u.lastName  ?? "",
      phone:     u.phone     ?? "",
      email:     u.email     ?? "",
      role:      u.role      ?? "user",
      isBanned:  u.isBanned  ?? false,
      avatar:    u.avatar    ?? "",
      createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("fa-IR") : "",
    })) as UserItem[],
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}
