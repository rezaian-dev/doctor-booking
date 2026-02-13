import { Skeleton } from '@/components/ui/skeleton';

// 💀 Loading skeleton
const ProfileSkeleton = () => (
  <div className="mx-auto max-w-4xl p-4 md:p-6">
    <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
      <div className="mb-10 flex justify-center">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
