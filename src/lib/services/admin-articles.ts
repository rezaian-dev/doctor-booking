// 📰 Admin article list query — extracted from (dashboard)/admin/articles/page.tsx
import { connectDB } from "@/lib/db/connection";
import { Article } from "@/lib/db/models/article";

export type ArticleItem = {
  _id: string;
  title: string;
  slug: string;
  author: string;
  status: string;
  tags: string[];
  createdAt: string;
};

const PAGE_SIZE = 10;

export async function getAdminArticles(page: number, search: string, status: string) {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (search) query.$or    = [{ title: { $regex: search, $options: "i" } }];

  const [raw, total] = await Promise.all([
    Article.find(query)
      .select("title slug author status tags createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean<{
        _id: unknown;
        title: string;
        slug: string;
        author: string;
        status: string;
        tags: string[];
        createdAt: Date;
      }[]>(),
    Article.countDocuments(query),
  ]);

  return {
    articles: raw.map((a) => ({
      _id:       String(a._id),
      title:     a.title,
      slug:      a.slug,
      author:    a.author ?? "",
      status:    a.status,
      tags:      a.tags   ?? [],
      createdAt: new Date(a.createdAt).toLocaleDateString("fa-IR"),
    })) as ArticleItem[],
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

// ✏️ Serialized article shape consumed by <ArticleForm initialData>
export type ArticleEditData = {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  status: string;
  tags: string[];
};

// 🔍 Single article for the edit page — lean() + ObjectId stripped. null ⇒ 404.
export async function getArticleForEdit(id: string): Promise<ArticleEditData | null> {
  await connectDB();

  const raw = await Article.findById(id).lean<{
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    author?: string;
    status: string;
    tags?: string[];
  }>();

  if (!raw) return null;

  return {
    title:      raw.title,
    content:    raw.content,
    excerpt:    raw.excerpt    ?? "",
    coverImage: raw.coverImage ?? "",
    author:     raw.author     ?? "",
    status:     raw.status,
    tags:       raw.tags       ?? [],
  };
}
