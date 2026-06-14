import type { Metadata } from 'next';
import PageTitle from '@/components/shared/page-title';
import SpecialtiesExplorer, { type Specialty } from '@/components/features/specialties/specialties-explorer';
import { DOCTOR_FILTERS } from '@/lib/constants/filters';
import { SPECIALTY_DESCRIPTIONS, DEFAULT_SPECIALTY_DESCRIPTION } from '@/lib/constants/specialties';
import { fetchSpecialtyCounts } from '@/lib/services/doctors';

export const metadata: Metadata = {
  title: 'لیست تخصص‌های پزشکی',
  description: 'مرور کامل تخصص‌های پزشکی و دندانپزشکی — انتخاب تخصص و مشاهده‌ی پزشکان متخصص هر حوزه برای رزرو نوبت آنلاین.',
  alternates: { canonical: '/specialties' },
  openGraph: {
    title: 'لیست تخصص‌ها | دکتر رزرو',
    description: 'تمام تخصص‌های پزشکی در یک نگاه؛ روی هر تخصص بزنید تا پزشکان مرتبط را ببینید.',
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: '/og-cover.png', width: 1200, height: 630, alt: 'دکتر رزرو' }], // 🖼️ branded share card
  },
};

// 🔄 force-dynamic: reads live doctor counts from MongoDB per request. ISR caused build-time
//    prerender failures because MongoDB isn't available during next build.
export const dynamic = 'force-dynamic';

// 🧩 Merge filter options (id + label) with their short descriptions — built once on the server
const SPECIALTY_OPTIONS = DOCTOR_FILTERS.find((f) => f.id === 'specialties')?.options ?? [];

export default async function SpecialtiesPage() {
  // 🔢 Live doctor count per specialty (cached, revalidated hourly); label matches Doctor.specialty.
  // 🛡️ Graceful fallback: show zero counts if the DB is unreachable.
  const counts = await fetchSpecialtyCounts(SPECIALTY_OPTIONS.map((o) => o.label)).catch(() => ({} as Record<string, number>));

  const specialties: Specialty[] = SPECIALTY_OPTIONS.map((o) => ({
    id: o.id,
    label: o.label,
    desc: SPECIALTY_DESCRIPTIONS[o.id] ?? DEFAULT_SPECIALTY_DESCRIPTION,
    count: counts[o.label] ?? 0,
  }));

  return (
    <>
      <PageTitle title="لیست تخصص‌ها" hasPadding backHref="/" />
      <SpecialtiesExplorer items={specialties} />
    </>
  );
}
