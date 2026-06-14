import ArticlesGrid from "@/components/features/articles/articles-grid";
import { getPublishedArticlesPage } from "@/lib/services/articles";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata = pageMetadata({
  title: "مقالات پزشکی | دکتر رزرو",
  description: "آخرین مقالات و اخبار پزشکی. راهنماهای تخصصی سلامت.",
  robots: "index, follow",
});

// 🔄 force-dynamic: reads live articles from MongoDB per request. ISR caused build-time
//    prerender failures because MongoDB isn't available during next build.
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArticlesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);
  // 🛡️ Graceful fallback: empty list if DB is unreachable
  const { articles, totalPages } = await getPublishedArticlesPage(currentPage).catch(() => ({ articles: [], totalPages: 0 }));
  return <ArticlesGrid articles={articles} totalPages={totalPages} />;
}
