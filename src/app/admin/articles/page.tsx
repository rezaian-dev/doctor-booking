// 📰 Article management. Auth handled by the route layout; shared <Pagination> used.
import { formatFaNumber } from "@/lib/utils/persian-format";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getAdminArticles } from "@/lib/services/admin-articles";
import Pagination from "@/components/shared/pagination";
import EntityActions from "@/components/admin/shared/entity-actions";
import ArticlesFilter from "@/components/admin/articles/articles-filter";
import TagList from "@/components/admin/articles/tag-list";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "مقالات | پنل ادمین",
  robots: { index: false, follow: false },
};

const STATUS: Record<string, { label: string; variant: "success" | "secondary" }> = {
  published: { label: "منتشر شده", variant: "success" },
  draft: { label: "پیش‌نویس", variant: "secondary" },
};

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

// 🔒 Admin is always per-request & auth-gated — never prerender at build (no DB at build time).
export const dynamic = "force-dynamic";

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search ?? "";
  const status = params.status ?? "";

  const { articles, total, totalPages } = await getAdminArticles(page, search, status);

  return (
    // 🖥️ Desktop (lg): exactly one viewport tall, never scrolls. 📱 Mobile keeps natural flow. 🧠
    <div className="flex flex-col gap-4 lg:h-full lg:overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">مدیریت مقالات</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{formatFaNumber(total)} مقاله</p>
        </div>
        <ButtonLink href="/admin/articles/new" className="shrink-0">
            <Plus size={16} />
            <span className="hidden sm:inline">مقاله جدید</span>
            <span className="sm:hidden">جدید</span>
        </ButtonLink>
      </div>

      <Suspense fallback={<div className="h-11 w-full animate-pulse rounded-xl bg-neutral-100" />}>
        <ArticlesFilter search={search} status={status} />
      </Suspense>

      {/* 📐 Fills leftover height on desktop → pagination pinned at the bottom, no scroll. 🧠 */}
      <div className="flex-1 lg:min-h-0 lg:overflow-hidden">
      {articles.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center text-sm text-neutral-400">
          مقاله‌ای یافت نشد
        </div>
      ) : (
        <>
          {/* 📱 Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {articles.map((a) => {
              const s = STATUS[a.status] ?? STATUS.draft!;
              return (
                <div key={a._id} className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-white p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start gap-2">
                      <p className="flex-1 text-sm font-semibold text-neutral-900">{a.title}</p>
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </div>
                    {a.author && <p className="mt-0.5 text-xs text-neutral-500">{a.author}</p>}
                    <p className="mt-0.5 text-xs text-neutral-400">{a.createdAt}</p>
                    <TagList tags={a.tags} />
                  </div>
                  <EntityActions entityLabel="مقاله" editHref={`/admin/articles/${a._id}/edit`} deleteUrl={`/api/admin/articles/${a._id}`} />
                </div>
              );
            })}
          </div>

          {/* 🖥️ Desktop table — container override clips the shadcn inner X-scroll; long
              titles/authors truncate so table-fixed columns never spill out of the card. */}
          <div className="hidden overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm lg:block [&_[data-slot=table-container]]:overflow-x-hidden">
            <Table className="table-fixed">
              <TableHeader className="bg-neutral-50 [&_tr]:border-b [&_tr]:border-neutral-100">
                <TableRow className="hover:bg-neutral-50">
                  <TableHead className="w-[42%] px-4 text-right text-neutral-600">عنوان</TableHead>
                  <TableHead className="w-[16%] px-3 text-right text-neutral-600">نویسنده</TableHead>
                  <TableHead className="w-[14%] px-3 text-right text-neutral-600">وضعیت</TableHead>
                  <TableHead className="w-[14%] px-3 text-right text-neutral-600">تاریخ</TableHead>
                  <TableHead className="w-[14%] px-3" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((a) => {
                  const s = STATUS[a.status] ?? STATUS.draft!;
                  return (
                    <TableRow key={a._id} className="border-neutral-100 hover:bg-neutral-50/70">
                      <TableCell className="px-4 py-2">
                        <p className="truncate font-medium text-neutral-900">{a.title}</p>
                        <TagList tags={a.tags} />
                      </TableCell>
                      <TableCell className="px-3 py-2 text-neutral-600">
                        <span className="block truncate">{a.author || "—"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2"><Badge variant={s.variant}>{s.label}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap px-3 py-2 text-xs text-neutral-500">{a.createdAt}</TableCell>
                      <TableCell className="px-3 py-2"><EntityActions entityLabel="مقاله" editHref={`/admin/articles/${a._id}/edit`} deleteUrl={`/api/admin/articles/${a._id}`} /></TableCell>
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
