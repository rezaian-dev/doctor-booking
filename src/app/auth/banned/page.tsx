import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "حساب مسدود شده",
  robots: { index: false },
};

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50" dir="rtl">
      <div className="text-center max-w-md px-6">
        <div className="text-6xl mb-6">🚫</div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          حساب کاربری مسدود شده است
        </h1>
        <p className="text-neutral-600 mb-8">
          حساب کاربری شما توسط مدیریت سامانه مسدود شده است. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary/90 transition-colors"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
