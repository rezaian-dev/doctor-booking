import ArticleCard from '@/components/shared/article-card';
import Pagination from '@/components/shared/pagination';
import { FC } from 'react';

const ArticlesGrid: FC = () => {
  // 📦 Static article data – replace with API later
  const articles = [
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
      excerpt:
        'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
    {
      id: 4,
      title: 'چگونه بهترین دکتر را برای نیازهای خود پیدا کنیم؟',
      excerpt:
        'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
    {
      id: 5,
      title: 'چگونه بهترین دکتر را برای نیازهای خود پیدا کنیم؟',
      excerpt:
        'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
    {
      id: 6,
      title: 'چگونه بهترین دکتر را برای نیازهای خود پیدا کنیم؟',
      excerpt:
        'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
    {
      id: 7,
      title: 'چگونه بهترین دکتر را برای نیازهای خود پیدا کنیم؟',
      excerpt:
        'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
    {
      id: 8,
      title: 'چگونه بهترین دکتر را برای نیازهای خود پیدا کنیم؟',
      excerpt:
        'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
    {
      id: 9,
      title: 'چگونه بهترین دکتر را برای نیازهای خود پیدا کنیم؟',
      excerpt:
        'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
  ] as const;
  return (
    <section className="container px-4 md:px-8 mt-6 md:mt-23">
      {/* 🏷️ Section heading */}
      <h1 className="text-neutral-975 font-medium text-lg md:text-2xl">
        آخرین مقالات
      </h1>

      {/* 🧱 Responsive article grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4.5 mt-4.5 pb-4.5 border-b border-neutral-100">
        {articles.map(article => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

      {/* 📄 Pagination controls */}
      <Pagination totalPages={40} className="mt-5 mb-8" />
    </section>
  );
};

export default ArticlesGrid;
