import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SpecialtyCard from './specialty-card';
import AosWrapper from '@/components/shared/aos-wrapper';
import { aosStagger } from '@/lib/utils/aos';
import { fetchSpecialtyCounts } from '@/lib/services/doctors';

const healthServices = [
  { id: 1, image: '/images/heart.png',       title: 'قلب و عروق',     specialtyId: 'cardiology',    dbLabel: 'قلب و عروق' },
  { id: 2, image: '/images/orthopedics.png', title: 'ارتوپد',         specialtyId: 'orthopedics',   dbLabel: 'ارتوپدی' },
  { id: 3, image: '/images/brain.png',       title: 'مغزواعصاب',      specialtyId: 'neurology',      dbLabel: 'مغز و اعصاب' },
  { id: 4, image: '/images/pulmonology.png', title: 'دستگاه تنفسی',   specialtyId: 'pulmonology',    dbLabel: 'ریه و دستگاه تنفسی' },
  { id: 5, image: '/images/eye-test.png',    title: 'چشم پزشکی',      specialtyId: 'ophthalmology',  dbLabel: 'چشم‌پزشکی' },
  { id: 6, image: '/images/pediatric.png',   title: 'اطفال',          specialtyId: 'pediatrics',     dbLabel: 'کودکان (اطفال)' },
  { id: 7, image: '/images/heart.png',       title: 'گوش حلق و بینی', specialtyId: 'ent',            dbLabel: 'گوش، حلق و بینی' },
] as const;

const SpecialtyGrid = async () => {
  // 🛡️ Graceful fallback: a DB hiccup (or missing env in local dev) must NOT crash
  //    the whole homepage — degrade to count=0 like the other home sections do.
  const counts = await fetchSpecialtyCounts(healthServices.map((s) => s.dbLabel)).catch(
    () => ({}) as Record<string, number>,
  );

  return (
    <section className="container px-4 md:px-8 mt-7.5 md:mt-31">
      {/* 🎯 Section header */}
      <AosWrapper animation="fade-down" className="flex items-center justify-between">
        <h2 className="font-medium text-xl md:text-2xl text-neutral-975">
          لیست تخصص‌ها
        </h2>
        <Link
          href="/specialties"
          className="group inline-flex items-center gap-x-1.5 font-medium text-sm text-neutral-600 hover:text-primary-600 focus:text-primary-600 transition-colors whitespace-nowrap"
          aria-label="View all medical specialties"
        >
          مشاهده همه
          <ChevronLeft
            size={20}
            className="text-neutral-600 group-hover:text-primary-600 transition-colors"
            aria-hidden="true"
          />
        </Link>
      </AosWrapper>

      {/* 🧱 Responsive grid — cards stagger in with zoom-in */}
      <div className="grid xl:grid-cols-7 md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-2 gap-4 gap-x-3.5 mt-4.5 auto-rows-fr">
        {healthServices.map((item, i) => (
          <AosWrapper key={item.id} animation="zoom-in" delay={aosStagger(i)}>
            <SpecialtyCard
              image={item.image}
              title={item.title}
              count={counts[item.dbLabel] ?? 0}
              href={`/doctors?specialty=${item.specialtyId}`}
            />
          </AosWrapper>
        ))}
      </div>
    </section>
  );
};

export default SpecialtyGrid;
