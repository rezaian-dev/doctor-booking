import { FC } from 'react';
import clsx from 'clsx';

// 🚦 Submit button with loading state & smooth UX
interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={clsx(
        'w-full py-4 px-6 rounded-xl font-bold text-lg text-white',
        'bg-linear-to-r from-blue-600 to-indigo-600',
        'hover:from-blue-700 hover:to-indigo-700',
        'focus:outline-none focus:ring-4 focus:ring-blue-300',
        'shadow-lg hover:shadow-xl transform transition-all',
        'hover:-translate-y-1',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          در حال ارسال...
        </span>
      ) : (
        'ارسال'
      )}
    </button>
  );
};

export default SubmitButton;
