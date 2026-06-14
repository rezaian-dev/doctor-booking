"use client";

import Image   from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/hooks/use-auth-guard";

const HeartHealthQuiz = dynamic(() => import("./heart-health-quiz"), { ssr: false });

interface Props { isLoggedIn?: boolean }

const HealthCTA = ({ isLoggedIn }: Props) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const { guard } = useAuthGuard(isLoggedIn);

  const handleStartQuiz = () => {
    guard(() => setIsQuizOpen(true));
  };

  return (
    <>
      <section className="container px-4 md:px-8 mt-8 md:mt-23.5">
        <div
          data-aos="fade-up"
          suppressHydrationWarning
          className="relative z-10 border-[1.5px] bg-white rounded-2xl border-neutral-100 overflow-hidden flex flex-col-reverse sm:flex-row"
        >
          <div className="flex flex-col justify-center lg:justify-start py-6 sm:py-0 px-4 lg:pr-18 lg:pt-10 grow">
            <h2 className="text-neutral-900 font-medium text-base sm:text-2xl lg:text-[32px] leading-tight">
              همین حالا رایگان تست سلامت بگیرید!
            </h2>
            <p className="mt-4 text-neutral-750 text-[13px] md:text-lg">
              در کمتر از دو دقیقه سلامت خود را ارزیابی کنید.
            </p>
            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="w-full max-w-30.25 md:max-w-50 h-10 md:h-14 bg-primary-500 hover:bg-primary-600 text-[13px] md:text-lg mt-2.5 md:mt-10"
            >
              شروع تست سلامت
            </Button>
          </div>

          <div>
            {/* ⚡ priority: above-the-fold image — was eager without sizes (browser mis-estimated the download)
                sizes: hints the browser which width is actually needed */}
            <Image
              src="/images/cta-health-check.png"
              width={492} height={329}
              alt="استتوسکوپ روی فرم‌های تست سلامت"
              className="w-full sm:h-82.25 object-cover sm:rounded-b-none rounded-b-2xl"
              priority
              sizes="(max-width: 640px) 100vw, 492px"
            />
          </div>

          <div className="absolute bottom-3 left-3 sm:left-10 lg:left-3 m-auto sm:right-0 z-50 w-max lg:bottom-12">
            <Image src="/images/ornament-decoration.png" alt="" width={134} height={101}
              className="w-12 h-12 xl:w-33.5 xl:h-25.25" loading="lazy" sizes="(max-width: 1280px) 48px, 134px" />
          </div>
          <div className="absolute top-3.75 right-3.75 z-50 md:-z-10 sm:right-21 sm:top-3.5">
            <Image src="/images/topology-pattern.png" alt="" width={157} height={150}
              className="w-10 h-10 md:w-39.25 md:h-37.5" loading="lazy" sizes="(max-width: 768px) 40px, 157px" />
          </div>
        </div>
      </section>

      <HeartHealthQuiz isOpen={isQuizOpen} onOpenChange={setIsQuizOpen} />
    </>
  );
};

export default HealthCTA;
