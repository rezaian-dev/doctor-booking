// 📰 Server Actions — create/update articles
"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { Article } from "@/lib/db/models/article";

// 🔄 Revalidate everything that lists articles. 🏷️ revalidateTag("articles") is required — the
//    home carousel + /articles read from unstable_cache, which revalidatePath alone can't bust.
function revalidateArticles() {
  revalidateTag("articles", { expire: 0 }); // ⏱️ immediate bust of the cached article data
  revalidatePath("/");
  revalidatePath("/articles");
}

/* ── Form state type ─────────────────────────────────────────────────────── */
export type ArticleFormState = {
  error?: string;
  success?: boolean;
};

/* 🔗 Slugify title — supports Persian characters */
function slugify(text: string): string {
  return text
    .normalize("NFC") // 🔤 consistent Unicode composition (matches read-side lookup)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .toLowerCase();
}

/* 📋 Parse FormData for article fields */
function parseArticleForm(formData: FormData) {
  const tags =
    (formData.get("tags") as string)
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  // 🔒 Narrow status to the permitted enum values — default to "draft" if unknown
  const rawStatus = (formData.get("status") as string) || "draft";
  const status = (rawStatus === "published" ? "published" : "draft") as "draft" | "published";

  return {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
    coverImage: formData.get("coverImage") as string,
    author: formData.get("author") as string,
    status,
    tags,
  };
}

/* ── Create Article ──────────────────────────────────────────────────────── */
export async function createArticle(
  _: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const data = parseArticleForm(formData);
  if (!data.title || !data.content)
    return { error: "عنوان و محتوا الزامی است" };

  await connectDB();

  // 🔗 Ensure slug uniqueness
  let slug = slugify(data.title);
  const exists = await Article.exists({ slug });
  if (exists) slug = `${slug}-${Date.now()}`;

  await Article.create({ ...data, slug });
  revalidateArticles();
  redirect("/admin/articles");
}

/* ── Update Article ──────────────────────────────────────────────────────── */
export async function updateArticle(
  id: string,
  _: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const data = parseArticleForm(formData);
  if (!data.title || !data.content)
    return { error: "عنوان و محتوا الزامی است" };

  await connectDB();
  await Article.findByIdAndUpdate(id, { $set: data });
  revalidateArticles();
  redirect("/admin/articles");
}
