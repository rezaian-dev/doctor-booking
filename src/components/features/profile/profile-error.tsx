'use client';

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

// ❌ Error display
const ProfileError =({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="flex min-h-100 items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-neutral-900">خطا در بارگذاری</h3>
        <p className="mb-6 text-sm text-neutral-600">لطفاً دوباره تلاش کنید</p>
        <Button
          onClick={onRetry}
          className="rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md"
        >
          تلاش مجدد
        </Button>
      </div>
    </div>
  );
}

export default ProfileError;
