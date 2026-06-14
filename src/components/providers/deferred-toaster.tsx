'use client';

// 🍞 Deferred Toaster — sonner is only needed once a toast fires (post-hydration). Load
//    it as a client-only chunk and mount on idle, so it never sits on the initial payload. 🚀
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { runWhenIdle } from '@/lib/utils/run-when-idle';

const Toaster = dynamic(
  () => import('@/components/ui/sonner').then((m) => m.Toaster),
  { ssr: false }
);

export default function DeferredToaster() {
  const [ready, setReady] = useState(false);

  // ⏳ Mount after first paint is comfortably done
  useEffect(() => runWhenIdle(() => setReady(true)), []);

  if (!ready) return null;
  return <Toaster richColors position="top-center" dir="rtl" />;
}
