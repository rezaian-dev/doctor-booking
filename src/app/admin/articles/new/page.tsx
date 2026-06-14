// ➕ Create article. Auth handled by the route layout.
import type { Metadata } from "next";
import ArticleForm from "@/components/admin/articles/article-form";
import { createArticle } from "@/lib/actions/articles";

export const metadata: Metadata = {
  title: "مقاله جدید | پنل ادمین",
  robots: { index: false, follow: false },
};

export default function NewArticlePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">مقاله جدید</h1>
        <p className="mt-1 text-sm text-neutral-500">مقاله جدید ایجاد کنید</p>
      </div>
      {/* 📝 createArticle server action */}
      <ArticleForm action={createArticle} submitLabel="ثبت مقاله" />
    </div>
  );
}
