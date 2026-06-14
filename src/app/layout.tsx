import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ZodFaProvider } from '@/components/providers/zod-fa-provider';
import { AosProvider } from '@/components/providers/aos-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { cn } from '@/lib/utils/cn';
import { SITE_URL } from '@/lib/constants/site';
import DeferredToaster from '@/components/providers/deferred-toaster';

const vazirmatn = localFont({
  src: [
    { path: '../fonts/Vazirmatn-Regular.woff2', weight: '400' },
    { path: '../fonts/Vazirmatn-Medium.woff2', weight: '500' },
    { path: '../fonts/Vazirmatn-Bold.woff2', weight: '700' },
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  // 🌐 Absolute base for all canonical/OG/Twitter URLs — resolved per-environment
  //    (never localhost in production). Set NEXT_PUBLIC_BASE_URL to your real domain. ✨
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'دکتر رزرو | نوبت‌دهی آنلاین پزشک',
    template: '%s | دکتر رزرو',
  },
  description: 'رزرو سریع نوبت پزشک متخصص در سراسر ایران — در کمتر از ۱ دقیقه.',
  keywords: ['نوبت پزشک', 'رزرو آنلاین', 'دکتر متخصص', 'نوبت‌دهی آنلاین'],
  authors: [{ name: 'دکتر رزرو' }],
  // 🎯 favicon is auto-detected from app/favicon.ico (Next.js file convention) — no manual wiring needed
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'دکتر رزرو',
    title: 'دکتر رزرو | نوبت‌دهی آنلاین پزشک',
    description: 'رزرو سریع نوبت پزشک متخصص در سراسر ایران.',
    images: [{ url: '/og-cover.png', width: 1200, height: 630, alt: 'دکتر رزرو | نوبت‌دهی آنلاین پزشک' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دکتر رزرو | نوبت‌دهی آنلاین پزشک',
    description: 'رزرو سریع نوبت پزشک متخصص.',
    images: ['/og-cover.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0066FF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} data-scroll-behavior="smooth">
      {/* 🚫📜 overflow-x: clip clips horizontally WITHOUT promoting overflow-y to `auto`,
          so <body> never turns into a scroll container — the admin shell stays the only scroller */}
      <body className={cn('min-w-[320px] antialiased overflow-x-clip font-sans')}>
        <NuqsAdapter>
          <ZodFaProvider />
          {/* 🎬 Initializes AOS so [data-aos] elements (e.g. the home search box) become visible.
              Without this, aos.css locks them at opacity:0 forever. */}
          <AosProvider />
          {children}
          <DeferredToaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
