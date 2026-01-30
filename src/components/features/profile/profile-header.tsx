import { Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';

type ProfileHeaderProps = {
  isEditMode: boolean;
  onEditToggle: () => void;
  onCancel: () => void;
};

export function ProfileHeader({ isEditMode, onEditToggle, onCancel }: ProfileHeaderProps) {
  return (
    <CardHeader className="space-y-4">
      <div className="flex flex-col pt-8 sm:flex-row justify-between items-start sm:items-center gap-3">
        <CardTitle className="text-xl">پروفایل کاربری</CardTitle>
        <Button
          variant={isEditMode ? 'destructive' : 'default'}
          onClick={isEditMode ? onCancel : onEditToggle}
          className={!isEditMode ? 'bg-primary-500 hover:bg-primary-600' : ''}
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
