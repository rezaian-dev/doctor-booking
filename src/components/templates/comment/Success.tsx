import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

// ✅ Success message component with shadcn Button
const Success = ({ onReset }: any) => (
  <div className="bg-linear-to-br from-secondary-50 to-secondary-100 rounded-2xl sm:rounded-3xl border-2 border-secondary-200 p-8 sm:p-10 md:p-12 text-center animate-fade-in">
    <div className="inline-flex w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-secondary-500 rounded-full items-center justify-center mb-4 sm:mb-5 md:mb-6 animate-bounce">
      <Check className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-neutral-30" strokeWidth={3} />
    </div>
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-neutral-900">نظر شما ثبت شد! 🎉</h2>
    <p className="text-sm sm:text-base text-neutral-600 mb-6 sm:mb-7 md:mb-8">از اینکه زمان گذاشتید متشکریم</p>
    <Button
      onClick={onReset}
      size="lg"
      className="bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-neutral-30 px-6 sm:px-7 md:px-8 h-12 sm:h-14 md:h-16 text-base sm:text-lg rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
    >
      ثبت نظر جدید
    </Button>
  </div>
);

export default Success;
