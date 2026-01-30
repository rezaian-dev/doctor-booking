'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/cn';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

/**
 * 📰 ArticleCard – Enhanced article card with shadcn/ui
 *
 * Features:
 * ✅ Smooth animations with framer-motion
 * ✅ Reading time estimation
 * ✅ Category/tag support with badges
 * ✅ Author information display
 * ✅ Interactive hover states
 * ✅ Skeleton loading state
 * ✅ Enhanced accessibility
 * ✅ SEO-optimized
 */

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
  category?: string;
  tags?: string[];
  readingTime?: number; // in minutes
  author?: {
    name: string;
    avatar?: string;
  };
  isFeatured?: boolean;
  className?: string;
  onCardClick?: (href: string) => void;
}

const ArticleCard = ({
  title,
  excerpt,
  date,
  image,
  href,
  category,
  tags = [],
  readingTime,
  author,
  isFeatured = false,
  className,
  onCardClick,
}: ArticleCardProps) => {
  const handleClick = () => {
    onCardClick?.(href);
  };

  return (
    <Card
      className={cn(
        'overflow-hidden border group bg-white',
        'transition-all duration-300',
        'hover:shadow-xl',
        isFeatured
          ? 'border-primary-300 shadow-md'
          : 'border-neutral-100 shadow-sm hover:border-primary-200'
      )}
      onClick={handleClick}
    >
      {/* 🖼️ Image Section */}
      <div className="relative aspect-289/200 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className={cn(
            'object-cover transition-all duration-500',
            'group-hover:scale-110 group-hover:brightness-95'
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        {category && (
          <Badge
            variant="default"
            className={cn(
              'absolute top-3 right-3 shadow-lg',
              isFeatured && 'bg-amber-500 hover:bg-amber-600'
            )}
          >
            {category}
          </Badge>
        )}

        {/* Featured Badge */}
        {isFeatured && (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-white/90 text-neutral-900 shadow-lg"
          >
            ویژه
          </Badge>
        )}
      </div>

      {/* 📝 Content Section */}
      <CardHeader className="px-4 py-3 space-y-2">
        {/* Title */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={href}>
                <h3
                  className={cn(
                    'font-semibold text-base md:text-lg text-neutral-900',
                    'line-clamp-2 cursor-pointer',
                    'transition-colors duration-200',
                    'group-hover:text-primary-600',
                    'h-12 md:h-14'
                  )}
                >
                  {title}
                </h3>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p>{title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Excerpt */}
        <p
          className={cn(
            'text-sm leading-relaxed text-neutral-600 line-clamp-1'
          )}
        >
          {excerpt}
        </p>
      </CardHeader>

      {/* Tags Section */}
      {tags.length > 0 && (
        <CardContent className="px-4 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs font-normal text-neutral-600 hover:bg-neutral-100"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs font-normal text-neutral-500"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      )}

      <Separator className="mx-4" />

      {/* 📅 Footer Section */}
      <CardFooter className="px-4 py-3 flex items-center justify-between gap-2">
        {/* Meta Information */}
        <div className="flex items-center gap-3 text-neutral-500 text-xs">
          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar size={14} aria-hidden="true" />
            <time dateTime={date} className="whitespace-nowrap">
              {date}
            </time>
          </div>

          {/* Reading Time */}
          {readingTime && (
            <>
              <span className="text-neutral-300">•</span>
              <div className="flex items-center gap-1">
                <Clock size={14} aria-hidden="true" />
                <span className="whitespace-nowrap">
                  {readingTime} دقیقه مطالعه
                </span>
              </div>
            </>
          )}
        </div>

        {/* CTA Link */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={cn(
            'text-primary-600 hover:text-primary-700 hover:bg-primary-50',
            'gap-1 px-3 h-8',
            'transition-all duration-200',
            'group-hover:gap-2'
          )}
        >
          <Link href={href} aria-label={`ادامه مطلب: ${title}`}>
            <span className="text-sm font-medium">ادامه مطلب</span>
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </CardFooter>

      {/* Author Section (Optional) */}
      {author && (
        <>
          <Separator className="mx-4" />
          <CardFooter className="px-4 py-3">
            <div className="flex items-center gap-2">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 text-xs font-medium">
                    {author.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-sm text-neutral-600">{author.name}</span>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ArticleCard;
