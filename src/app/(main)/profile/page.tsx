import ProfileContent from "@/components/features/profile/profile-content";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata = pageMetadata({
  title: "پروفایل من | دکتر رزرو",
  description: "مدیریت اطلاعات حساب کاربری.",
  robots: { index: false, follow: false },
});

// 🧱 Static shell — no server cookie/DB read, so it prerenders once and paints instantly &
//    identically on every refresh (no jump/flash/reload). 🔐 Auth still fully covered: the edge
//    proxy redirects token-less guests, and <ProfileContent> 401s & redirects client-side. ✨
export const dynamic = "force-static";

export default function ProfilePage() {
  // 🧱 StandardLayout owns the <main> landmark; this is a styled wrapper only
  return (
    <div
      className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 pt-20 pb-8"
      dir="rtl"
    >
      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">پروفایل کاربری</h1>
          <p className="text-sm text-gray-600">مشاهده و ویرایش اطلاعات شخصی</p>
        </header>
        <ProfileContent />
      </div>
    </div>
  );
}
