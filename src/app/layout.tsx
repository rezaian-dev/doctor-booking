import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { cn } from '@/lib/utils/cn';
import { getAuthUser } from '@/lib/auth/auth-session';

// 🖋️ Vazirmatn font configuration
const vazirmatn = localFont({
  src: [
    { path: '../assets/fonts/Vazirmatn-Regular.woff2', weight: '400' },
    { path: '../assets/fonts/Vazirmatn-Medium.woff2', weight: '500' },
    { path: '../assets/fonts/Vazirmatn-Bold.woff2', weight: '700' },
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// 📄 SEO metadata
export const metadata: Metadata = {
  title: 'دکتر رزرو',
  description: 'وقت ویزیت با بهترین پزشکان — سریع، آسان و مطمئن.',
  icons: { icon: '/favicon.ico' },
};

// 📱 Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0066FF',
};

// 🌐 Root layout with auth
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={cn('min-w-[320px] min-h-screen antialiased overflow-x-hidden font-sans')} suppressHydrationWarning>
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
