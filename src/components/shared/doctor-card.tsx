// 🧠 Client Component — interactive doctor card with auth guard.
// ✨ No AOS (it conflicts with Swiper's DOM management) — pure CSS transitions instead. 🚫
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { NO_IMAGE } from '@/lib/utils/profile-card';

export interface DoctorCardProps {
  _id:              string;
  name:             string;
  specialty:        string;
  city:             string;
  photo:            string;
  hasOnlineVisit:   boolean;
  hasInPersonVisit: boolean;
  isAvailable:      boolean;
  reviewCount:      number;
  avgRating:        number;
  index?:           number;
  isLoggedIn?:      boolean;
}

export default function DoctorCard({
  _id, name, specialty, city, photo,
  hasOnlineVisit, hasInPersonVisit,
  isAvailable, reviewCount, avgRating,
  isLoggedIn,
}: DoctorCardProps) {
  const router = useRouter();
  const { guard } = useAuthGuard(isLoggedIn);

  // 📷 Real photo vs. the "/images/no-image.png" fallback (callers pass it pre-resolved)
  const hasPhoto = Boolean(photo) && photo !== NO_IMAGE;

  // 🔐 Auth guard: show toast if not authenticated
  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAvailable) return;
    guard(() => router.push(`/doctors/${_id}`));
  };

  return (
    <Card className="overflow-hidden h-full group border border-neutral-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-primary-300 gap-0">

      {/* 🖼️ Doctor photo — smart fit:
          • real photo → shown in FULL (object-contain), never cropped; a blurred copy
            fills the frame so any aspect ratio looks intentional (no empty bars).
          • no photo  → the placeholder fills the frame cleanly (blurring it looks odd). */}
      <div className="relative aspect-289/200 w-full overflow-hidden bg-neutral-100">
        {hasPhoto ? (
          <>
            {/* 🌫️ Backdrop: blurred + zoomed copy paints the empty sides */}
            <Image
              src={photo}
              alt=""
              aria-hidden
              fill
              className="scale-125 object-cover blur-2xl brightness-95"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* 🩺 Foreground: full doctor photo, contained → never cropped */}
            <Image
              src={photo}
              alt={name}
              fill
              className="relative z-1 object-contain transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </>
        ) : (
          /* 🚫 No photo → placeholder fills the frame, no blur trickery */
          <Image
            src={NO_IMAGE}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
        {!isAvailable && (
          <div className="absolute top-3 left-3 z-2">
            {/* 🚫 "danger" maps to the red badge variant defined in badge.tsx */}
            <Badge variant="danger">نوبت تکمیل</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3 sm:p-4 space-y-3">
        {/* ⭐ Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm sm:text-base text-neutral-900 line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-1 rounded-md">
            <Star className="text-amber-500 fill-amber-500" size={12} />
            <span className="text-xs font-medium text-neutral-700">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-neutral-700">({reviewCount}) نظر</span>
          </div>
        </div>

        {/* 📍 Specialty + city */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="text-xs font-normal max-w-[60%] truncate">{specialty}</Badge>
          <div className="flex items-center gap-1 text-neutral-600">
            <MapPin size={14} className="text-neutral-700" />
            <span className="text-xs">{city}</span>
          </div>
        </div>

        {/* 🏥 Visit type badges */}
        <div className="flex gap-1.5">
          {hasInPersonVisit && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">حضوری</span>
          )}
          {hasOnlineVisit && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-50 text-secondary-700 border border-secondary-200">آنلاین</span>
          )}
        </div>
      </CardContent>

      {/* 🔗 CTA button */}
      <CardFooter className="p-3 sm:p-4">
        <Button
          variant="outline"
          disabled={!isAvailable}
          onClick={handleBooking}
          className="w-full h-9 sm:h-10 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          {isAvailable ? 'دریافت نوبت' : 'نوبت موجود نیست'}
        </Button>
      </CardFooter>
    </Card>
  );
}
