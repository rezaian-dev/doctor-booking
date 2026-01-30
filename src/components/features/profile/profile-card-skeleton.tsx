'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 💀 Profile Card Skeleton
 * Loading state for profile card
 */
export default function ProfileCardSkeleton() {
  return (
    <Card className="shadow-lg">
      {/* 🎛️ Header */}
      <CardHeader className="space-y-4">
        <div className="flex flex-col pt-8 sm:flex-row justify-between items-start sm:items-center gap-3">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardHeader>

      {/* 📝 Content */}
      <CardContent className="p-6 md:p-8">
        <div className="space-y-6">
          {/* 👤 Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* 📋 Form fields (8 fields in 2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
