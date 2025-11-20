// 🧱 Root Layout — RTL, Vazirmatn Font & Core Styles ✨
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 🖋️ Load Vazirmatn font (optimized .woff2 files for Persian support)
const vazirmatn = localFont({
  src: [
    { path: "../assets/fonts/Vazirmatn-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/Vazirmatn-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/Vazirmatn-Bold.woff2", weight: "700" },
  ],
  variable: "--font-vazirmatn", // CSS variable for global use
  display: "swap",              // Prevent FOIT (Flash of Invisible Text)
});

// 📄 SEO metadata — title, description & favicon
export const metadata: Metadata = {
  title: "دکتر رزرو",
  description: "وقت ویزیت با بهترین پزشکان — سریع، آسان و مطمئن.",
  icons: {
    icon: "/favicon.ico",       // Favicon from /public
  },
};

// 🌐 Main layout wrapper — applies to all pages
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} min-w-[320px] overflow-x-hidden! min-h-screen antialiased`}
>
        {children}
      </body>
    </html>
  );
}
