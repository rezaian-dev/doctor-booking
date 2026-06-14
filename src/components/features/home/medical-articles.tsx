'use client';

import ArticleCard from '@/components/shared/article-card';
import SwiperSection from '@/components/shared/swiper-section';
import { SectionEmptyState } from '@/components/shared/section-empty-state';
import { SectionHeader } from '@/components/shared/section-header';
import type { ArticleCardData } from '@/lib/services/articles';

interface MedicalArticlesProps {
  title?:    string;
  articles:  ArticleCardData[]; // 🗄️ fetched server-side, passed from the home page
}

const CONTAINER = 'container px-4 md:px-8 mt-7.5 mb-8 md:mb-16 md:mt-10';

/**
 * 📚 MedicalArticles — newest published articles, carousel via shared SwiperSection.
 *    Data is fetched on the server (page.tsx) and passed down as props.
 *    Shows a polished empty state instead of silently disappearing.
 */
const MedicalArticles = ({ title = 'آخرین مقالات', articles }: MedicalArticlesProps) => {
  if (articles.length === 0) {
    return (
      <section className={CONTAINER}>
        <SectionHeader title={title} viewAllHref="/articles" className="mb-5" />
        <SectionEmptyState variant="articles" />
      </section>
    );
  }

  return (
    <SwiperSection
      title={title}
      viewAllHref="/articles"
      items={articles}
      autoplay
      renderItem={(article: ArticleCardData, index) => (
        <ArticleCard
          title={article.title}
          excerpt={article.excerpt}
          date={article.date}
          image={article.coverImage || '/images/no-image.png'}
          href={`/articles/${article.slug}`}
          tags={article.tags}
          readingTime={article.readingTime}
          index={index ?? 0}
          {...(article.author ? { author: { name: article.author } } : {})}
        />
      )}
      getItemKey={(article: ArticleCardData) => article.slug}
      containerClassName={CONTAINER}
    />
  );
};

export default MedicalArticles;
