'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';

// 🚀 Dynamic import to avoid SSR issues
const HeartHealthQuiz = dynamic(() => import('./HeartHealthQuiz'), {
  ssr: false,
});

const HealthCTA: React.FC = () => {
  // 🎭 State to control dialog visibility
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // 🎯 Handle button click
  const handleStartQuiz = () => {
    console.log('Opening quiz dialog...');
    setIsQuizOpen(true);
  };

  return (
    <>
      <section className="container px-4 md:px-8 mt-8 md:mt-[94px]">
        {/* ✨ Main CTA card: RTL layout with responsive image + content */}
        <div className="relative z-10 border-[1.5px] bg-white rounded-2xl border-neutral-100 overflow-hidden flex flex-col-reverse sm:flex-row">
          {/* 📝 Content section */}
          <div className="flex flex-col justify-center lg:justify-start py-6 sm:py-0 px-4 lg:pr-[72px] lg:pt-10 grow">
            <h2 className="text-neutral-900 font-medium text-base sm:text-2xl lg:text-[32px] leading-tight">
              همین حالا رایگان تست سلامت بگیرید!
            </h2>
            <p className="mt-4 text-neutral-750 text-[13px] md:text-lg">
              در کمتر از دو دقیقه سلامت خود را ارزیابی کنید.
            </p>

            {/* 🚀 Start Quiz Button - Using Shadcn Button */}
            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="w-full max-w-[121px] md:max-w-[200px] h-10 md:h-14 bg-primary-500 hover:bg-primary-600 text-[13px] md:text-lg mt-2.5 md:mt-10"
            >
              شروع تست سلامت
            </Button>
          </div>

          {/* 🖼️ Image section */}
          <div>
            <Image
              src="/images/cta-health-check.png"
              width={492}
              height={329}
              alt="استتوسکوپ روی فرم‌های تست سلامت — شروع تست رایگان"
              className="w-full sm:h-[329px] object-cover sm:rounded-b-none rounded-b-2xl"
              loading="eager"
            />
          </div>

          {/* 🎨 Background decoration: Ornament (bottom-left) */}
          <div className="absolute bottom-3 left-3 sm:left-10 lg:left-3 m-auto sm:right-0 z-50 w-max lg:bottom-12">
            <Image
              src="/images/Ornament.png"
              alt=""
              width={134}
              height={101}
              className="w-12 h-12 xl:w-[134px] xl:h-[101px]"
            />
          </div>

          {/* 🎨 Background decoration: Topology (top-right) */}
          <div className="absolute top-[15px] right-[15px] z-50 md:-z-10 sm:right-[84px] sm:top-3.5">
            <Image
              src="/images/Topology.png"
              alt=""
              width={157}
              height={150}
              className="w-10 h-10 md:w-[157px] md:h-[150px]"
            />
          </div>
        </div>
      </section>

      {/* 🎊 Quiz Dialog Component */}
      <HeartHealthQuiz isOpen={isQuizOpen} onOpenChange={setIsQuizOpen} />
      <Toaster position="top-center" richColors />
    </>
  );
};

export default HealthCTA;
