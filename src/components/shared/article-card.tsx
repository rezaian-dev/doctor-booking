"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ArticleCardProps {
  title:        string;
  excerpt:      string;
  date:         string;
  image:        string;
  href:         string;
  readingTime?: number;
  // 🧩 Kept for caller compatibility — tags are not rendered on the compact card
  tags?:        string[];
  author?:      { name: string; avatar?: string };
  category?:    string;
  isFeatured?:  boolean;
  className?:   string;
  index?:       number;
}

// 📰 Compact article card — same vertical rhythm as DoctorCard so the
//    "Latest articles" carousel lines up with "Most popular doctors".
export default function ArticleCard({
  title, excerpt, date, image, href, readingTime, author, className,
}: ArticleCardProps) {
  // 👤 First letter of the author name for the initial-avatar fallback
  const authorName    = author?.name?.trim() ?? "";
  const authorInitial = authorName.charAt(0) || "ن";

  return (
    <Card className={cn(
      "group h-full gap-0 overflow-hidden border border-neutral-200 bg-white transition-all duration-300 hover:border-primary-300 hover:shadow-lg",
      className,
    )}>
      {/* 🖼️ Cover — fixed box height; the FULL image is shown (no crop), and a
          blurred twin of the same image fills the letterbox bars with its own
          colors so nothing looks empty. Same src ⇒ browser caches it once. */}
      <Link href={href} className="article-cover relative block aspect-289/200 w-full shrink-0 overflow-hidden bg-neutral-100">
        {/* 🌫️ Blurred fill behind */}
        <Image
          src={image}
          alt=""
          aria-hidden
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="cover-bg scale-110 blur-xl"
        />
        {/* 🎯 Full, uncropped image on top */}
        <Image
          src={image}
          alt={title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="cover-fg transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* 📝 Content — grows to fill so the footer always pins to the bottom */}
      <CardContent className="flex grow flex-col space-y-2 p-3 sm:p-4">
        <Link href={href}>
          <h3 className="line-clamp-2 min-h-[2.6em] text-sm font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-primary-600 sm:text-base">
            {title}
          </h3>
        </Link>

        {/* 📐 min-h reserves 2 lines (leading-relaxed) so short excerpts don't shrink the card */}
        <p className="line-clamp-2 min-h-[3.25em] text-xs leading-relaxed text-neutral-600 sm:text-sm">{excerpt}</p>

        {/* 👤 Author byline — only when an author exists */}
        {authorName && (
          <div className="flex items-center gap-2 border-t border-neutral-100 pt-2.5">
            {author?.avatar ? (
              <span className="relative size-7 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-50">
                <Image src={author.avatar} alt={authorName} fill sizes="28px" className="object-cover" />
              </span>
            ) : (
              // 🅰️ Initial avatar — gradient keeps it premium without an image
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-[11px] font-bold text-white ring-2 ring-primary-50">
                {authorInitial}
              </span>
            )}
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-semibold text-neutral-800">{authorName}</p>
              <p className="text-[10px] text-neutral-600">نویسنده</p>
            </div>
          </div>
        )}

        {/* 📅 Meta — pinned to the bottom of the content area (mt-auto) */}
        <div className="mt-auto flex items-center gap-3 pt-0.5 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Calendar size={13} aria-hidden />
            <time dateTime={date} className="whitespace-nowrap">{date}</time>
          </span>
          {readingTime ? (
            <>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Clock size={13} aria-hidden />
                {readingTime} دقیقه مطالعه
              </span>
            </>
          ) : null}
        </div>
      </CardContent>

      {/* 🔗 CTA → article detail */}
      <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
        <ButtonLink
          href={href}
          aria-label={`ادامه مطلب: ${title}`}
          variant="outline"
          className="h-9 w-full gap-1 border-primary-500 text-primary-600 transition-colors duration-200 hover:bg-primary-500 hover:text-white sm:h-10"
        >
          <span className="text-sm font-medium">ادامه مطلب</span>
          <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" aria-hidden />
        </ButtonLink>
      </CardFooter>
    </Card>
  );
}
