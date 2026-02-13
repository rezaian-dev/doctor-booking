import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

type ProfileSubmitButtonProps = {
  loading: boolean;
};

export function ProfileSubmitButton({ loading }: ProfileSubmitButtonProps) {
  return (
    <div className="flex justify-center pt-4">
      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className={cn(
          'gap-2 min-w-50 bg-primary-500 hover:bg-primary-600 text-white transition-all',
          loading && 'opacity-80 cursor-not-allowed'
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            در حال ذخیره...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            ذخیره تغییرات
          </>
        )}
      </Button>
    </div>
  );
}
