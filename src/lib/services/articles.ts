// 📰 Public article queries (home, listing, detail). Caching is page-level ISR; writes call
//    revalidatePath in the article actions so new content appears at once.
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { Article } from "@/lib/db/models/article";
import { jalaliDisplayDate } from "@/hooks/use-jalaali";

const PAGE_SIZE = 9;
const SELECT = "title slug excerpt coverImage author tags content createdAt";

// 🔗 Normalize a slug before querying: Persian route params can arrive percent-encoded, so
//    decode defensively (no-op if already decoded) and apply Unicode NFC for consistency.
function normalizeSlug(slug: string): string {
  let s = slug;
  try {
    s = decodeURIComponent(slug);
  } catch {
    /* 🛟 malformed percent-encoding → keep the raw value */
  }
  return s.normalize("NFC");
}

// 🧹 Strip HTML → plain text (excerpt fallback + reading-time estimate)
const stripHtml = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// ⏱️ ~200 words/min, minimum 1 minute
const readingTime = (html: string) => {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// 🃏 Card-friendly shape (no heavy content in the payload)
export interface ArticleCardData {
  title: string;
  excerpt: string;
  coverImage: string;
  slug: string;
  author: string;
  tags: string[];
  date: string;        // 📅 Jalali, e.g. "15 Farvardin 1404"
  readingTime: number; // ⏱️ minutes
}

// 📖 Full detail shape (includes rendered HTML content)
export interface ArticleDetailData extends ArticleCardData {
  content: string;
}

type RawArticle = {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  content: string;
  createdAt: Date;
};

// 🔁 DB doc → card shape, with graceful fallbacks
function toCard(a: RawArticle): ArticleCardData {
  const plain = stripHtml(a.content ?? "");
  return {
    title:       a.title,
    excerpt:     a.excerpt?.trim() || plain.slice(0, 120),
    coverImage:  a.coverImage ?? "",
    slug:        a.slug,
    author:      a.author ?? "",
    tags:        a.tags ?? [],
    date:        jalaliDisplayDate(new Date(a.createdAt)),
    readingTime: readingTime(a.content ?? ""),
  };
}

// 🏠 Newest published articles for the home carousel
async function getPublishedArticlesInternal(limit = 8): Promise<ArticleCardData[]> {
  await connectDB();
  const raw = await Article.find({ status: "published" })
    .select(SELECT).sort({ createdAt: -1 }).limit(limit)
    .lean<RawArticle[]>();
  return raw.map(toCard);
}

// ⚡ Cached for the home page (no per-request DB hit), revalidated daily, tagged "articles"
//    so a mutation can refresh it instantly via revalidateTag("articles").
export const getPublishedArticles = unstable_cache(
  getPublishedArticlesInternal,
  ["home-articles"],
  { revalidate: 86400, tags: ["articles"] }, // 🗓️ daily ISR — DB hit at most once/day
);

// 📄 Paginated published articles for /articles. Cached per page + tagged "articles", so a
//    publish/edit busts every page via revalidateTag. The route is force-dynamic, so this
//    cache keeps repeat visits off the DB. 🧠
async function getPublishedArticlesPageInternal(page = 1): Promise<{
  articles: ArticleCardData[];
  totalPages: number;
  total: number;
}> {
  await connectDB();
  const safePage = Math.max(1, page);
  const [raw, total] = await Promise.all([
    Article.find({ status: "published" })
      .select(SELECT).sort({ createdAt: -1 })
      .skip((safePage - 1) * PAGE_SIZE).limit(PAGE_SIZE)
      .lean<RawArticle[]>(),
    Article.countDocuments({ status: "published" }),
  ]);
  return {
    articles:   raw.map(toCard),
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export const getPublishedArticlesPage = unstable_cache(
  getPublishedArticlesPageInternal,
  ["articles-page"],
  { revalidate: 3600, tags: ["articles"] }, // 🏷️ busted on publish/edit via revalidateTag("articles")
);

// 🔗 Related articles for the detail page — prefer shared tags, backfill with newest.
//    Always excludes the current article and de-duplicates across both passes.
export async function getRelatedArticles(
  currentSlug: string,
  tags: string[],
  limit = 3,
): Promise<ArticleCardData[]> {
  await connectDB();
  const slug = normalizeSlug(currentSlug); // 🔗 match the form stored in the DB
  const base = { status: "published" as const, slug: { $ne: slug } };

  // 🎯 Pass 1 — articles sharing at least one tag
  const tagged = tags.length
    ? await Article.find({ ...base, tags: { $in: tags } })
        .select(SELECT).sort({ createdAt: -1 }).limit(limit)
        .lean<RawArticle[]>()
    : [];

  if (tagged.length >= limit) return tagged.map(toCard);

  // 🔁 Pass 2 — backfill with the newest articles not already chosen
  const exclude = [slug, ...tagged.map((a) => a.slug)];
  const fillers = await Article.find({ status: "published", slug: { $nin: exclude } })
    .select(SELECT).sort({ createdAt: -1 }).limit(limit - tagged.length)
    .lean<RawArticle[]>();

  return [...tagged, ...fillers].map(toCard);
}

// 🔍 Single published article by slug — null ⇒ 404
export async function getArticleBySlug(slug: string): Promise<ArticleDetailData | null> {
  await connectDB();
  const raw = await Article.findOne({ slug: normalizeSlug(slug), status: "published" })
    .select(SELECT).lean<RawArticle | null>();
  if (!raw) return null;
  return { ...toCard(raw), content: raw.content ?? "" };
}

// 🗺️ All published slugs — feeds generateStaticParams so every article is prerendered at
//    build (static on refresh, like /faq). Selects only slug; new articles still work via ISR. 🧠
export async function getAllPublishedSlugs(): Promise<string[]> {
  await connectDB();
  const rows = await Article.find({ status: "published" })
    .select("slug").lean<{ slug: string }[]>();
  return rows.map((r) => r.slug);
}
