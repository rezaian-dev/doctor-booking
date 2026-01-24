import { useCountdown } from '@/hooks/useCountdown';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface ResendTimerProps {
  onResend: () => void;
}

// ⏱️ Resend timer component with smooth transitions
export const ResendTimer = ({ onResend }: ResendTimerProps) => {
  const { timeLeft, isFinished, restart, formattedTime } = useCountdown(90);

  const handleResend = () => {
    onResend();
    restart();
  };

  return (
    <div className="mt-4 min-h-20 flex items-center justify-center">
      {/* 🔄 Resend button - shown when timer finished */}
      <Button
        type="button"
        variant="ghost"
        onClick={handleResend}
        className={clsx(
          'w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50',
          'transition-opacity duration-300',
          isFinished ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'
        )}
      >
        ارسال مجدد کد
      </Button>

      {/* ⏳ Timer display - shown while counting down */}
      <div
        className={clsx(
          'flex flex-col items-center gap-2 transition-opacity duration-300',
          !isFinished ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'
        )}
      >
        <div
          className={clsx(
            'text-lg transition-colors',
            timeLeft < 10 ? 'text-danger-500 animate-pulse' : 'text-primary-800'
          )}
        >
          {formattedTime}
        </div>
        <p className="text-sm text-neutral-500">تا دریافت مجدد کد</p>
      </div>
    </div>
  );
};
