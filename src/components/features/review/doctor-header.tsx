import { DoctorData } from '@/types/doctor';
import { Sparkles, UserRound } from 'lucide-react';
import Image from 'next/image';
import { formatDoctorName } from '@/lib/utils/doctor-name';

// 🩺 Review-form banner — refined gradient header with soft glow, an intro line, a specialty
//    pill, and a clean آدمک fallback when the doctor has no photo. ✨
const DoctorHeader = ({ data }: { data: DoctorData }) => {
  const hasImage = !!data.image && data.image.trim() !== '' && !data.image.includes('no-image');

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-primary-500 via-primary-600 to-primary-700 p-5 sm:p-6 md:p-8">
      {/* 🌫️ Decorative glow blobs */}
      <div className="pointer-events-none absolute -top-12 -left-10 w-40 h-40 rounded-full bg-neutral-30/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 -right-8 w-48 h-48 rounded-full bg-neutral-30/10 blur-3xl" />

      <div className="relative flex items-center gap-3 sm:gap-4 md:gap-5 animate-fade-in">
        {/* 🖼️ Avatar with glow + sparkle badge */}
        <div className="relative group shrink-0">
          <div className="absolute inset-0 bg-neutral-30 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 sm:border-3 md:border-4 border-neutral-30 shadow-2xl overflow-hidden bg-primary-100 flex items-center justify-center">
            {hasImage ? (
              <Image
                src={data.image}
                alt={data.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                loading="lazy"
                unoptimized
              />
            ) : (
              <UserRound className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" aria-hidden />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-neutral-30 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-alert" />
          </div>
        </div>

        {/* 👤 Doctor info */}
        <div className="text-neutral-30 min-w-0 flex-1">
          <p className="text-neutral-50/80 text-[11px] sm:text-xs mb-0.5 sm:mb-1">در حال ثبت نظر برای</p>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-1.5 truncate">{formatDoctorName(data.name)}</h2>
          {data.specialty && (
            <span className="inline-flex items-center rounded-full bg-neutral-30/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-neutral-30 backdrop-blur-sm">
              {data.specialty}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorHeader;
