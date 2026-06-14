import { DoctorData } from '@/types/doctor';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const DoctorHeader = ({ data }: { data: DoctorData }) => (
  <div className="relative overflow-hidden bg-linear-to-br from-primary-500 via-primary-600 to-primary-700 p-4 sm:p-6 md:p-8">
    <div className="relative flex items-center gap-3 sm:gap-4 md:gap-5 animate-fade-in">
      {/* 🖼️ Avatar with glow + AI badge */}
      <div className="relative group">
        <div className="absolute inset-0 bg-neutral-30 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
        <Image
          src={data.image || '/images/no-image.png'}
          alt={data.name}
          width={96}
          height={96}
          className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 sm:border-3 md:border-4 border-neutral-30 shadow-2xl"
          sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
          loading="lazy"
          unoptimized
        />
        <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-neutral-30 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-alert" />
        </div>
      </div>

      {/* 👤 Doctor info */}
      <div className="text-neutral-30 min-w-0 flex-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1 truncate">{data.name}</h2>
        <p className="text-neutral-50 text-xs sm:text-sm truncate">{data.specialty}</p>
      </div>
    </div>
  </div>
);

export default DoctorHeader;
