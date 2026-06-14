import { ProfileCardSkeleton } from '@/components/shared/profile-card-skeleton';

// ⏳ Suspense fallback for <DoctorList> — a hookless Server Component that renders
//    instantly and matches the list wrapper 1:1 → zero layout shift. 🧩
export default function DoctorListSkeleton() {
  return (
    <div className="space-y-4 border-b border-neutral-100 pb-4 min-h-60">
      {Array.from({ length: 5 }, (_, i) => <ProfileCardSkeleton key={i} />)}
    </div>
  );
}
