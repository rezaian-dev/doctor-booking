'use client';

import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCountdown } from '@/hooks/use-countdown';
import { cn } from '@/lib/utils/cn';

interface ResendTimerProps {
  onResend: () => void;
}

export const ResendTimer = ({ onResend }: ResendTimerProps) => {
  const { timeLeft, isFinished, restart, formattedTime } = useCountdown(60);

  const handleResend = () => {
    onResend();
    restart();
  };

  return (
    <div className="flex min-h-9.5 items-center justify-center">

      {/* ⏳ Countdown pill */}
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-full bg-neutral-75 px-3 py-1.5',
          'transition-opacity duration-300',
          isFinished ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'
        )}
        aria-live="polite"
      >
        <Clock className="h-3.25 w-3.25 shrink-0 text-neutral-400" aria-hidden="true" />
        <span className="text-xs text-neutral-600">ارسال مجدد تا</span>
        <span
          className={cn(
            'min-w-8 text-center font-mono text-[12.5px] font-semibold transition-colors duration-300',
            timeLeft < 10 ? 'text-danger-500 animate-pulse' : 'text-primary-600'
          )}
        >
          {formattedTime}
        </span>
      </div>

      {/* 🔁 Resend button */}
      <Button
        type="button"
        onClick={handleResend}
        className={cn(
          'rounded-[9px] border border-primary-200 bg-transparent',
          'px-3.5 py-1.5 text-xs font-medium text-primary-600',
          'hover:bg-primary-50 transition-colors duration-150',
          'font-[Vazirmatn,Tahoma,sans-serif]',
          'transition-opacity duration-300',
          isFinished ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'
        )}
      >
        ارسال مجدد کد
      </Button>
    </div>
  );
};
