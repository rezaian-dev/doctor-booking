'use client';

import ArticleCard from "@/components/ArticleCard";
import SwiperSection from "@/components/SwiperSection";



interface MedicalArticlesProps {
  title?: string;
}

// 📦 Article data type
interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
}

/**
 * 📚 MedicalArticles – Refactored using shared SwiperSection
 * ✅ Clean & DRY | ✅ Type-safe | ✅ Maintainable
 */
const MedicalArticles = ({ title = 'آخرین مقالات' }: MedicalArticlesProps) => {
  // 📦 Static article data – replace with API in production
  const articles: readonly Article[] = [
    {
      id: 1,
      title: '۱۰ نشانه هشدار دهنده مشکلات قلبی',
      excerpt: 'اگر این ۱۰ نشانه را داشتید حتما به پزشک مراجعه کنید...',
      date: '۱۴۰۳/۰۸/۱۵',
      image: '/images/article-1.png',
      href: '/articles/1',
    },
    {
      id: 2,
      title: '۵ گام ساده برای پیشگیری از دیابت',
      excerpt: '۵ گام ساده برای پیشگیری از دیابت نوع ۲ ...',
      date: '۱۴۰۳/۰۸/۱۰',
      image: '/images/article-2.png',
      href: '/articles/2',
    },
    {
      id: 3,
      title: 'چگونه بهترین دکتر را برای نیازهای خود پیدا کنیم؟',
      excerpt: 'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
    {
      id: 4,
      title: 'چگونه بهترین دکتر را برای نیازهای خود پیدا کنیم؟',
      excerpt: 'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
  ] as const;

  return (
    <SwiperSection
      title={title}
      viewAllHref="/articles"
      items={articles}
      renderItem={article => <ArticleCard {...article} />}
      getItemKey={article => article.id}
      containerClassName="container px-4 md:px-8 mt-7.5 mb-8 md:mb-16 md:mt-10"
    />
  );
};

export default MedicalArticles;
