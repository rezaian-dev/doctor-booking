// 🧷 (main) layout — pages with full Header + Footer. No force-dynamic: the header reads
//    no cookies server-side, so each page picks its own strategy — public content (articles,
//    specialties) → ISR/SSG; user pages (profile, appointments) opt into SSR individually.

import type { ReactNode } from 'react';
import StandardLayout from '@/components/layout/standard-layout';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <StandardLayout>{children}</StandardLayout>;
}
