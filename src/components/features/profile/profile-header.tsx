import { Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

type ProfileHeaderProps = {
  isEditMode: boolean;
  onEditToggle: () => void;
  onCancel: () => void;
};

// 📝 Profile card header
export function ProfileHeader({ isEditMode, onEditToggle, onCancel }: ProfileHeaderProps) {
  return (
    <CardHeader className="space-y-4">
      <div className="flex flex-col pt-8 sm:flex-row justify-between items-start sm:items-center gap-3">
        <CardTitle className="text-xl text-neutral-900">پروفایل کاربری</CardTitle>
        <Button
          variant={isEditMode ? 'destructive' : 'default'}
          onClick={isEditMode ? onCancel : onEditToggle}
          className={cn(
            'transition-all',
            isEditMode
              ? 'bg-danger-500 hover:bg-danger-600 text-white'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          )}
        >
          {isEditMode ? (
            <>
              <X className="w-4 h-4 ml-2" />
              انصراف
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 ml-2" />
              ویرایش
            </>
          )}
        </Button>
      </div>
    </CardHeader>
  );
}
