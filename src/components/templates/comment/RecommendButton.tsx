import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Check,ThumbsUp, ThumbsDown } from "lucide-react";

// 👍👎 Recommendation button with responsive design using shadcn Button
const RecommendButton = ({ type, selected, onClick }: any) => {
  const isRec = type === 'recommend';
  const Icon = isRec ? ThumbsUp : ThumbsDown;

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={clsx(
        'relative h-auto p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3 group',
        selected
          ? isRec
            ? 'border-secondary-400 bg-linear-to-br from-secondary-50 to-secondary-100 shadow-lg shadow-secondary-200/50 scale-105 hover:bg-linear-to-br hover:from-secondary-50 hover:to-secondary-100'
            : 'border-danger-400 bg-linear-to-br from-danger-50 to-danger-100 shadow-lg shadow-danger-200/50 scale-105 hover:bg-linear-to-br hover:from-danger-50 hover:to-danger-100'
          : 'border-neutral-150 bg-neutral-30 hover:border-neutral-200 hover:shadow-md hover:bg-neutral-30'
      )}
    >
      <div className={clsx(
        'p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300',
        selected
          ? isRec ? 'bg-secondary-500' : 'bg-danger-500'
          : isRec ? 'bg-secondary-100 group-hover:bg-secondary-200' : 'bg-danger-100 group-hover:bg-danger-200'
      )}>
        <Icon className={clsx(
          'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all duration-300',
          selected
            ? 'text-neutral-30 scale-110'
            : isRec ? 'text-secondary-600' : 'text-danger-600'
        )} />
      </div>
      <span className={clsx(
        'text-xs sm:text-sm md:text-base font-bold transition-colors text-center',
        selected
          ? isRec ? 'text-secondary-700' : 'text-danger-700'
          : 'text-neutral-700'
      )}>
        {isRec ? 'پیشنهاد می‌کنم' : 'پیشنهاد نمی‌کنم'}
      </span>
      {selected && (
        <div className={clsx(
          'absolute top-2 sm:top-3 left-2 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center animate-ping-once',
          isRec ? 'bg-secondary-500' : 'bg-danger-500'
        )}>
          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-30 animate-none" strokeWidth={3} />
        </div>
      )}
    </Button>
  );
};

export default RecommendButton;
