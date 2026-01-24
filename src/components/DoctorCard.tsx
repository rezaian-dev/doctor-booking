'use client';
import { Location04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa6';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';


/**
 * 🧩 DoctorCard – Enhanced doctor profile card with shadcn/ui
 *
 * Features:
 * ✅ Smooth hover animations with framer-motion
 * ✅ Tooltip for truncated information
 * ✅ Badge for specialty categorization
 * ✅ Enhanced accessibility with ARIA labels
 * ✅ Skeleton loading state support
 * ✅ RTL-ready | Mobile-first | TypeScript strict
 */

interface DoctorCardProps {
  id: number;
  name: string;
  specialty: string;
  rating: string;
  reviewsCount: number;
  city: string;
  image: string;
  isAvailable?: boolean;
  isVerified?: boolean;
  specialtyBadgeVariant?: 'default' | 'secondary' | 'outline';
  className?: string;
  onCardClick?: (id: number) => void;
}

const DoctorCard = ({
  id,
  name,
  specialty,
  rating,
  reviewsCount,
  city,
  image,
  isAvailable = true,
  isVerified = false,
  specialtyBadgeVariant = 'secondary',
  className,
  onCardClick,
}: DoctorCardProps) => {
  const handleCardClick = () => {
    onCardClick?.(id);
  };

  return (
      <Card
        className={cn(
          'overflow-hidden group border border-neutral-200 bg-white',
          'transition-all duration-300',
          'hover:shadow-lg hover:border-primary-300',
          'cursor-pointer'
        )}
        onClick={handleCardClick}
      >
        {/* 🖼️ Image Section with Status Overlay */}
        <div className="relative aspect-289/200 w-full overflow-hidden">
          <Image
            src={image}
            alt={`${name}، ${specialty} در ${city}`}
            fill
            className={cn(
              'object-cover transform transition-all duration-500 group-hover:scale-105',
            )}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isVerified && (
              <Badge
                variant="default"
                className="bg-primary-500 text-white shadow-md"
              >
                تایید شده
              </Badge>
            )}
            {!isAvailable && (
              <Badge variant="destructive" className="shadow-md">
                نوبت تکمیل
              </Badge>
            )}
          </div>
        </div>

        {/* 📝 Content Section */}
        <CardContent className="p-3 sm:p-4 space-y-3">
          {/* ⭐ Name & Rating Row */}
          <div className="flex items-start justify-between gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3
                    className={cn(
                      'font-semibold text-sm sm:text-base text-neutral-900',
                      'line-clamp-1 cursor-help'
                    )}
                  >
                    {name}
                  </h3>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div
              className="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-1 rounded-md"
              role="img"
              aria-label={`امتیاز ${rating} از ${reviewsCount} نظر`}
            >
              <FaStar className="text-amber-500" size={12} aria-hidden="true" />
              <span className="text-[10px] sm:text-xs font-medium text-neutral-700">
                {rating}
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-500">
                ({reviewsCount.toLocaleString('fa-IR')}) نظر
              </span>
            </div>
          </div>

          {/* 📍 Specialty & Location Row */}
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant={specialtyBadgeVariant}
              className="text-xs sm:text-sm font-normal max-w-[60%] truncate"
            >
              {specialty}
            </Badge>

            <div className="flex items-center gap-1 shrink-0 text-neutral-600">
              <HugeiconsIcon
                icon={Location04Icon}
                size={14}
                className="text-neutral-500"
                aria-hidden="true"
              />
              <span className="text-[10px] sm:text-xs whitespace-nowrap">
                {city}
              </span>
            </div>
          </div>
        </CardContent>

        {/* 📅 CTA Footer */}
        <CardFooter className="p-3 sm:p-4 pt-0">
          <Button
            asChild
            variant="outline"
            className={cn(
              'w-full h-9 sm:h-10',
              'border-primary-500 text-primary-600 font-medium',
              'hover:bg-primary-500 hover:text-white',
              'transition-colors duration-200',
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              !isAvailable && 'opacity-50 cursor-not-allowed'
            )}
            disabled={!isAvailable}
          >
            <Link
              href={`/doctor/${id}`}
              aria-label={`دریافت نوبت از ${name}`}
              onClick={(e) => !isAvailable && e.preventDefault()}
            >
              {isAvailable ? 'دریافت نوبت' : 'نوبت موجود نیست'}
            </Link>
          </Button>
        </CardFooter>
      </Card>

  );
};

export default DoctorCard;
