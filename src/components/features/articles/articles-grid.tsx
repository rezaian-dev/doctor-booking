import { Suspense } from 'react';
import { FileText } from 'lucide-react';
import ArticleCard from '@/components/shared/article-card';
import Pagination from '@/components/shared/pagination';
import AosWrapper from '@/components/shared/aos-wrapper';
import { aosStagger } from '@/lib/utils/aos';
import type { ArticleCardData } from '@/lib/services/articles';

interface Props {
  articles:   ArticleCardData[];
  totalPages: number;
}

const ArticlesGrid = ({ articles, totalPages }: Props) => {
  return (
    <section className="container px-4 md:px-8 mt-6 md:mt-23">
      <AosWrapper animation="fade-down">
        <h1 className="text-neutral-975 font-medium text-lg md:text-2xl">آخرین مقالات</h1>
      </AosWrapper>

      {articles.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 py-16 text-center">
          <FileText size={28} className="text-neutral-300" />
          <p className="text-sm text-neutral-600">هنوز مقاله‌ای منتشر نشده است.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4.5 mt-4.5 pb-4.5 border-b border-neutral-100">
            {articles.map((article, i) => (
              <AosWrapper key={article.slug} animation="fade-up" delay={aosStagger(i % 3)}>
                <ArticleCard
                  title={article.title}
                  excerpt={article.excerpt}
                  date={article.date}
                  image={article.coverImage || '/images/no-image.png'}
                  href={`/articles/${article.slug}`}
                  tags={article.tags}
                  readingTime={article.readingTime}
                  index={i}
                  {...(article.author ? { author: { name: article.author } } : {})}
                />
              </AosWrapper>
            ))}
          </div>

          {totalPages > 1 && (
            <Suspense fallback={null}>
              <Pagination totalPages={totalPages} className="mt-5 mb-8" />
            </Suspense>
          )}
        </>
      )}
    </section>
  );
};

export default ArticlesGrid;
