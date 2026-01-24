import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// 🚦 Submit button with loading state & smooth UX
interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-6 text-lg font-bold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          در حال ارسال...
        </span>
      ) : (
        'ارسال'
      )}
    </Button>
  );
};

export default SubmitButton;
