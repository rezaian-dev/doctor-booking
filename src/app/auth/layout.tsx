// 🔐 Auth layout — login, register, banned pages.
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import StandardLayout from '@/components/layout/standard-layout';
import { RedirectIfAuthenticated } from '@/components/features/auth/redirect-if-authenticated';

// 🚀 No force-dynamic: login/register/banned read no cookies or searchParams during render
//    (callbackUrl is read client-side in the handler), so the whole auth group is STATICALLY
//    prerendered. Soft navigation serves the prefetched payload instantly → no server round-trip,
//    no blank loading fallback, no flash/reload — exactly as smooth as /faq & /about-us. 🧠✨

// 🏷️ No title here on purpose: login/register own their titles (absolute, single brand)
//    and banned sets its own. A default here would re-introduce a double brand.
export const metadata: Metadata = {
  description: 'ورود و ثبت‌نام در سامانه نوبت‌دهی آنلاین دکتر رزرو.',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  // 🛡️ Soft guard: confirmed logged-in users are redirected home via the CLIENT router
  //    (smooth soft nav) — replacing the proxy redirect that used to hard-reload the page.
  return (
    <StandardLayout>
      <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>
    </StandardLayout>
  );
}
