// ✏️ Edit article. Auth handled by the route layout; data fetched via the service.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleForm from "@/components/admin/articles/article-form";
import { getArticleForEdit } from "@/lib/services/admin-articles";
import { updateArticle } from "@/lib/actions/articles";
import type { ArticleFormState } from "@/lib/actions/articles";

export const metadata: Metadata = {
  title: "ویرایش مقاله | پنل ادمین",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

// 🔒 Admin is always per-request & auth-gated — never prerender at build (no DB at build time).
export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticleForEdit(id);
  if (!article) notFound();

  // 🔗 Bind article id to the update action
  const boundAction = async (
    state: ArticleFormState,
    formData: FormData,
  ): Promise<ArticleFormState> => {
    "use server";
    return updateArticle(id, state, formData);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">ویرایش مقاله</h1>
        <p className="mt-1 text-sm text-neutral-500">{article.title}</p>
      </div>
      <ArticleForm action={boundAction} initialData={article} submitLabel="ذخیره تغییرات" />
    </div>
  );
}
