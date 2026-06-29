import PageTitle from '@/components/shared/page-title';
import SpecialtiesExplorerSkeleton from '@/components/features/specialties/specialties-explorer-skeleton';

// ⏳ Route-level loading UI — Next.js wraps page.tsx in Suspense automatically.
// This file renders instantly (no async work) while fetchSpecialtyCounts() runs in page.tsx.
// animate={false}: title must not fade — it's above the fold and must be stable from paint-zero. 🔒
export default function SpecialtiesLoading() {
  return (
    <>
      <PageTitle title="لیست تخصص‌ها" hasPadding backHref="/" animate={false} />
      <SpecialtiesExplorerSkeleton />
    </>
  );
}
