import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowRight, ArrowLeft, CalendarDays, Clock, Stethoscope } from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import ArticleCard from "@/components/shared/article-card";
import ArticleReadingProgress from "@/components/features/articles/article-reading-progress";
import ArticleShare from "@/components/features/articles/article-share";
import { getArticleBySlug, getRelatedArticles, getAllPublishedSlugs } from "@/lib/services/articles";

// 🧱 ISR (not force-dynamic): articles are public & identical for all, so each is prerendered
//    and cache-served → instant & stable, like /faq. ⏱️ 1h is just a safety net — edits bust the
//    slug instantly via revalidatePath(`/articles/${slug}`). 🧠
export const revalidate = 3600;

// 🧱 Prerender every published article at build → static HTML on refresh (like /faq).
//    New slugs render on-demand via ISR. The try/catch keeps the build green if the DB
//    is unreachable at build (falls back to pure ISR). ✨
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// 🧠 Memoize per-request → generateMetadata + the page share ONE DB read
const getArticle = cache(getArticleBySlug);

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 🔎 Dynamic SEO + OpenGraph from the live article (title, excerpt, cover image)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug).catch(() => null);

  // 🛟 Fallback metadata when the article can't be loaded
  if (!article) {
    return {
      title: "مقاله", // 🏷️ template adds the brand once
      description: "مطالب علمی و کاربردی در حوزه سلامت از دکتر رزرو",
      alternates: { canonical: `/articles/${slug}` },
    };
  }

  const description = (article.excerpt?.trim() || article.title).slice(0, 160);

  return {
    title: article.title, // 🏷️ bare title → root template appends " | دکتر رزرو" exactly once
    description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      locale: "fa_IR",
      ...(article.author ? { authors: [article.author] } : {}),
      // 🖼️ Use the article cover as the share card when available
      ...(article.coverImage ? { images: [{ url: article.coverImage, alt: article.title }] } : {}),
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  // 🔗 Sibling content for the bottom of the page
  const related = await getRelatedArticles(slug, article.tags, 3);

  const authorName    = article.author.trim();
  const authorInitial = authorName.charAt(0) || "ن";

  return (
    <>
      {/* 📊 Scroll-linked reading progress */}
      <ArticleReadingProgress />

      <article className="container max-w-3xl px-4 py-8 md:px-8 md:py-12">
        {/* ↩️ Back to listing */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-primary-600"
        >
          <ArrowRight size={16} />
          بازگشت به مقالات
        </Link>

        {/* 🏷️ Tags */}
        {article.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
            ))}
          </div>
        )}

        {/* 📰 Title */}
        <h1 className="mt-4 text-2xl font-bold leading-snug text-neutral-950 md:text-[34px] md:leading-tight">
          {article.title}
        </h1>

        {/* 👤 Byline + meta + share — the editorial header band */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-y border-neutral-100 py-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500">
            {authorName && (
              <span className="flex items-center gap-2.5">
                {/* 🅰️ Initial avatar */}
                <span className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-sm font-bold text-white ring-2 ring-primary-50">
                  {authorInitial}
                </span>
                <span className="leading-tight">
                  <span className="block font-semibold text-neutral-800">{authorName}</span>
                  <span className="block text-xs text-neutral-400">نویسنده</span>
                </span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} className="text-neutral-400" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} className="text-neutral-400" />
              {article.readingTime} دقیقه مطالعه
            </span>
          </div>

          {/* 🔗 Share toolbar */}
          <ArticleShare title={article.title} />
        </div>

        {/* 🖼️ Cover hero */}
        {article.coverImage && (
          <div className="relative mt-7 aspect-video w-full overflow-hidden rounded-2xl border border-neutral-100 shadow-sm">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {/* 📄 Content */}
        <div
          className="article-prose mt-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* 👤 Author bio card */}
        {authorName && (
          <aside className="mt-10 flex items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-30 p-5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-xl font-bold text-white ring-4 ring-primary-50">
              {authorInitial}
            </span>
            <div className="min-w-0">
              <p className="text-base font-bold text-neutral-900">{authorName}</p>
              <p className="text-xs text-primary-600">نویسندهٔ دکتر رزرو</p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                نویسنده و کارشناس محتوای سلامت در دکتر رزرو؛ تولید مطالب علمی و کاربردی برای ارتقای آگاهی شما دربارهٔ سلامت.
              </p>
            </div>
          </aside>
        )}

        {/* 🩺 Product CTA — bridge from reading to booking */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-linear-to-l from-primary-600 to-primary-700 p-6 text-center sm:p-8">
          <Stethoscope size={28} className="mx-auto text-primary-100" aria-hidden />
          <h2 className="mt-3 text-lg font-bold text-white sm:text-xl">سؤالی دربارهٔ سلامتتان دارید؟</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-primary-100">
            از پزشکان متخصص دکتر رزرو در کمتر از یک دقیقه نوبت آنلاین یا حضوری بگیرید.
          </p>
          <ButtonLink href="/doctors" variant="success" className="mt-4 gap-1.5">
              یافتن پزشک متخصص
              <ArrowLeft size={16} aria-hidden />
          </ButtonLink>
        </div>

        {/* 🔚 Footer link */}
        <div className="mt-10 border-t border-neutral-100 pt-6">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowRight size={16} />
            مشاهدهٔ مقالات بیشتر
          </Link>
        </div>
      </article>

      {/* 🔗 Related articles */}
      {related.length > 0 && (
        <section className="container max-w-5xl px-4 pb-12 md:px-8 md:pb-20">
          <div className="mb-5 flex items-center justify-between border-t border-neutral-100 pt-10">
            <h2 className="text-lg font-bold text-neutral-950 md:text-xl">مقالات مرتبط</h2>
            <Link
              href="/articles"
              className="flex items-center gap-1 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
            >
              مشاهده همه
              <ArrowLeft size={16} aria-hidden />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <ArticleCard
                key={item.slug}
                title={item.title}
                excerpt={item.excerpt}
                date={item.date}
                image={item.coverImage || "/images/no-image.png"}
                href={`/articles/${item.slug}`}
                tags={item.tags}
                readingTime={item.readingTime}
                index={i}
                {...(item.author ? { author: { name: item.author } } : {})}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
