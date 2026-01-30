import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  loadingText: string;
  buttonText: string;
  type?: 'submit' | 'button';
}

/**
 * 🧠 Reusable submit button with loading state
 */
export const SubmitButton = ({
  isLoading,
  disabled,
  loadingText,
  buttonText,
  type = 'submit',
}:SubmitButtonProps) => {
  return (
    <Button
      type={type}
      disabled={isLoading || disabled}
      className="w-full bg-primary-600 cursor-pointer hover:bg-primary-700 text-white h-12 text-sm md:text-base font-medium rounded-xl"
    >
      {isLoading ? (
        <>
          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          {loadingText}
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
};
