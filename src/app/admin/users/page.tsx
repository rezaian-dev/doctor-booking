// 👥 User management. Auth handled by the route layout; shared <Pagination> used.
import { Suspense } from "react";
import { formatFaNumber } from "@/lib/utils/persian-format";
import type { Metadata } from "next";
import { getAdminUsers } from "@/lib/services/admin-users";
import Pagination from "@/components/shared/pagination";
import UserActions from "@/components/admin/users/user-actions";
import UsersFilter from "@/components/admin/users/users-filter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "کاربران | پنل ادمین",
  robots: { index: false, follow: false },
};

const ROLE: Record<string, { label: string; variant: "default" | "success" | "secondary" }> = {
  admin: { label: "ادمین", variant: "default" },
  doctor: { label: "دکتر", variant: "success" },
  user: { label: "کاربر", variant: "secondary" },
};

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}

// 🔒 Admin is always per-request & auth-gated — never prerender at build (no DB at build time).
export const dynamic = "force-dynamic";

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search ?? "";
  const role = params.role ?? "";

  const { users, total, totalPages } = await getAdminUsers(page, search, role);

  return (
    // 🖥️ Desktop (lg): the page is exactly one viewport tall and never scrolls (h-full +
    //    overflow-hidden). 📱 Mobile keeps natural flow. gap tightened so 10 rows fit. 🧠
    <div className="flex flex-col gap-4 lg:h-full lg:overflow-hidden">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">مدیریت کاربران</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{formatFaNumber(total)} کاربر</p>
      </div>

      <Suspense fallback={<div className="h-11 w-full max-w-lg animate-pulse rounded-xl bg-neutral-100" />}>
        <UsersFilter search={search} role={role} />
      </Suspense>

      {/* 📐 Fills the leftover height on desktop so pagination sits at the bottom with no
          scroll; min-h-0 lets it shrink inside the fixed-height column. 🧠 */}
      <div className="flex-1 lg:min-h-0 lg:overflow-hidden">
      {users.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center text-sm text-neutral-400">
          کاربری یافت نشد
        </div>
      ) : (
        <>
          {/* 📱 Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {users.map((u) => {
              const rc = ROLE[u.role] ?? ROLE.user!;
              return (
                <div key={u._id} className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-white p-4">
                  <Avatar className="size-11 bg-primary-100">
                    <AvatarImage src={u.avatar} alt={`${u.firstName} ${u.lastName}`} />
                    <AvatarFallback className="bg-primary-100 text-xs font-bold text-primary-700">{u.firstName?.[0]}{u.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{u.firstName} {u.lastName}</p>
                      <Badge variant={rc.variant}>{rc.label}</Badge>
                      {u.isBanned && <Badge variant="danger">مسدود</Badge>}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-400">{u.email}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{u.phone}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">{u.createdAt}</p>
                  </div>
                  <UserActions userId={u._id} currentRole={u.role} isBanned={u.isBanned} />
                </div>
              );
            })}
          </div>

          {/* 🖥️ Desktop table — [data-slot=table-container] override clips the shadcn inner
              X-scroll; table-fixed widths keep every column inside the card (no scroll). */}
          <div className="hidden overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm lg:block [&_[data-slot=table-container]]:overflow-x-hidden">
            <Table className="table-fixed">
              <TableHeader className="bg-neutral-50 [&_tr]:border-b [&_tr]:border-neutral-100">
                <TableRow className="hover:bg-neutral-50">
                  <TableHead className="w-[28%] px-4 text-right text-neutral-600">کاربر</TableHead>
                  <TableHead className="w-[16%] px-3 text-right text-neutral-600">تلفن</TableHead>
                  <TableHead className="w-[12%] px-3 text-right text-neutral-600">نقش</TableHead>
                  <TableHead className="w-[12%] px-3 text-right text-neutral-600">وضعیت</TableHead>
                  <TableHead className="w-[12%] px-3 text-right text-neutral-600">تاریخ ثبت</TableHead>
                  <TableHead className="w-[20%] px-3" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const rc = ROLE[u.role] ?? ROLE.user!;
                  return (
                    <TableRow key={u._id} className="border-neutral-100 hover:bg-neutral-50/70">
                      <TableCell className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-8 bg-primary-100">
                            <AvatarImage src={u.avatar} alt={`${u.firstName} ${u.lastName}`} />
                            <AvatarFallback className="bg-primary-100 text-xs font-bold text-primary-700">{u.firstName?.[0]}{u.lastName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-neutral-900">{u.firstName} {u.lastName}</p>
                            <p className="truncate text-xs text-neutral-400">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs text-neutral-600">{u.phone}</TableCell>
                      <TableCell className="px-3 py-2"><Badge variant={rc.variant}>{rc.label}</Badge></TableCell>
                      <TableCell className="px-3 py-2">
                        {u.isBanned ? <Badge variant="danger">مسدود</Badge> : <Badge variant="success">فعال</Badge>}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs text-neutral-500">{u.createdAt}</TableCell>
                      <TableCell className="px-3 py-2"><UserActions userId={u._id} currentRole={u.role} isBanned={u.isBanned} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      </div>

      {totalPages > 1 && <Pagination totalPages={totalPages} />}
    </div>
  );
}
