// 📰 REST API — GET/PUT/DELETE a single article by id. ⚠️ /api/admin/* isn't guarded by the
//    page middleware, so it self-enforces admin via requireApiAdmin. Writes revalidate every
//    surface that lists articles.
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { Article } from "@/lib/db/models/article";
import { requireApiAdmin } from "@/lib/auth/require-api-admin";

type Ctx = { params: Promise<{ id: string }> };

// 🔄 Refresh every cached surface that lists/shows this article. 🏷️ revalidateTag("articles")
//    busts the unstable_cache behind the home carousel + /articles (revalidatePath can't reach it).
function revalidateArticle(slug?: string) {
  revalidateTag("articles", { expire: 0 }); // ⏱️ immediate bust of cached article data
  revalidatePath("/");               // 🏠 home carousel
  revalidatePath("/articles");       // 📄 public listing
  revalidatePath("/admin/articles"); // 🗂️ admin table
  if (slug) revalidatePath(`/articles/${slug}`); // 📰 detail page
}

// 🔍 GET — single article (admin)
export async function GET(_: NextRequest, ctx: Ctx) {
  const denied = await requireApiAdmin(); // 🛡️ admin only
  if (denied) return denied;
  const { id } = await ctx.params;
  await connectDB();
  const article = await Article.findById(id).lean();
  if (!article) return NextResponse.json({ error: "مقاله یافت نشد" }, { status: 404 });
  return NextResponse.json({ data: { ...article, _id: String((article as { _id: unknown })._id) } });
}

// ✏️ PUT — update fields (e.g. status toggle from the admin table)
export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await requireApiAdmin(); // 🛡️ admin only
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = (await req.json()) as Record<string, unknown>;
  await connectDB();
  const article = await Article.findByIdAndUpdate(id, { $set: body }, { new: true });
  if (!article) return NextResponse.json({ error: "مقاله یافت نشد" }, { status: 404 });
  revalidateArticle(article.slug);
  return NextResponse.json({ data: article });
}

// 🗑️ DELETE — remove permanently
export async function DELETE(_: NextRequest, ctx: Ctx) {
  const denied = await requireApiAdmin(); // 🛡️ admin only
  if (denied) return denied;
  const { id } = await ctx.params;
  await connectDB();
  const article = await Article.findByIdAndDelete(id);
  if (!article) return NextResponse.json({ error: "مقاله یافت نشد" }, { status: 404 });
  revalidateArticle(article.slug);
  return NextResponse.json({ message: "مقاله حذف شد" });
}
