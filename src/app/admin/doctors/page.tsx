// 🩺 Doctor management — auth handled by the route layout, shared <Pagination> used.
//    Natural document flow: the layout's <main> is the only scroll container. 🚫📜
import { formatFaNumber } from "@/lib/utils/persian-format";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getAdminDoctors } from "@/lib/services/admin-doctors";
import Pagination from "@/components/shared/pagination";
import EntityActions from "@/components/admin/shared/entity-actions";
import { SearchFilter } from "@/components/admin/shared/search-filter";
import VisitBadges from "@/components/admin/doctors/visit-badges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "پزشکان | پنل ادمین",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

// 🔒 Admin is always per-request & auth-gated — never prerender at build (no DB at build time).
export const dynamic = "force-dynamic";

export default async function DoctorsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search ?? "";

  const { doctors, total, totalPages } = await getAdminDoctors(page, search);

  return (
    <div className="flex h-full flex-col gap-4">
      {/* 🔝 Header */}
      <div className="flex shrink-0 items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">مدیریت دکترها</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{formatFaNumber(total)} دکتر</p>
        </div>
        <ButtonLink href="/admin/doctors/new" className="shrink-0">
            <Plus size={16} />
            <span className="hidden sm:inline">دکتر جدید</span>
            <span className="sm:hidden">جدید</span>
        </ButtonLink>
      </div>

      {/* 🔍 Filter */}
      <div className="shrink-0">
        <Suspense fallback={<div className="h-11 w-full animate-pulse rounded-xl bg-neutral-100" />}>
          <SearchFilter search={search} placeholder="جستجو بر اساس نام، تخصص یا شهر..." />
        </Suspense>
      </div>

      {/* 📋 Content — fills remaining height, scrolls internally */}
      <div className="min-h-0 flex-1">
        {doctors.length === 0 ? (
          <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center text-sm text-neutral-400">
            دکتری یافت نشد
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            {/* 📱 Mobile cards */}
            <div className="space-y-3 lg:hidden">
              {doctors.map((doc) => (
                <div key={doc._id} className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-4">
                  <Avatar className="size-11 bg-primary-100">
                    <AvatarImage src={doc.photo} alt={doc.name} />
                    <AvatarFallback className="bg-primary-100 font-bold text-primary-700">{doc.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">{doc.name}</p>
                    <p className="truncate text-xs text-neutral-500">{doc.specialty} — {doc.city}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">{formatFaNumber(doc.visitFee)} تومان</p>
                    <VisitBadges online={doc.hasOnlineVisit} inPerson={doc.hasInPersonVisit} />
                  </div>
                  <EntityActions entityLabel="دکتر" editHref={`/admin/doctors/${doc._id}/edit`} deleteUrl={`/api/admin/doctors/${doc._id}`} />
                </div>
              ))}
            </div>

            {/* 🖥️ Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm lg:block">
              <Table className="table-fixed">
                <TableHeader className="bg-neutral-50 [&_tr]:border-b [&_tr]:border-neutral-100">
                  <TableRow className="hover:bg-neutral-50">
                    <TableHead className="w-[24%] px-4 text-right text-neutral-600">دکتر</TableHead>
                    <TableHead className="w-[18%] px-3 text-right text-neutral-600">تخصص</TableHead>
                    <TableHead className="w-[12%] px-3 text-right text-neutral-600">شهر</TableHead>
                    <TableHead className="w-[14%] px-3 text-right text-neutral-600">کد نظام</TableHead>
                    <TableHead className="w-[14%] px-3 text-right text-neutral-600">ویزیت (ت)</TableHead>
                    <TableHead className="w-[10%] px-3 text-right text-neutral-600">نوع</TableHead>
                    <TableHead className="w-[8%] px-3" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doc) => (
                    <TableRow key={doc._id} className="border-neutral-100 hover:bg-neutral-50/70">
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-9 bg-primary-100">
                            <AvatarImage src={doc.photo} alt={doc.name} />
                            <AvatarFallback className="bg-primary-100 text-xs font-bold text-primary-700">{doc.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="truncate text-sm font-medium text-neutral-900">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="truncate px-3 py-3 text-xs text-neutral-600">{doc.specialty}</TableCell>
                      <TableCell className="truncate px-3 py-3 text-xs text-neutral-600">{doc.city}</TableCell>
                      <TableCell className="px-3 py-3 text-xs text-neutral-500">{doc.medicalCode}</TableCell>
                      <TableCell className="px-3 py-3 text-xs text-neutral-600">{formatFaNumber(doc.visitFee)}</TableCell>
                      <TableCell className="px-3 py-3"><VisitBadges online={doc.hasOnlineVisit} inPerson={doc.hasInPersonVisit} /></TableCell>
                      <TableCell className="px-3 py-3"><EntityActions entityLabel="دکتر" editHref={`/admin/doctors/${doc._id}/edit`} deleteUrl={`/api/admin/doctors/${doc._id}`} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && <Pagination totalPages={totalPages} />}
          </div>
        )}
      </div>
    </div>
  );
}
